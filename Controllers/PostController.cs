using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json.Linq;
using System.Linq;
using Test.Areas.Identity.Data;
using Test.Data;
using Test.Data.Enum;
using Test.Data.Services;
using Test.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Test.Controllers
{
    public class PostController : Controller
    {
        private readonly IPostService _postService;
        private readonly IAuthorService _authorService;
        private readonly IPost_ParticipantService _participantService;
        private readonly INotificationService _notificationService;
        private readonly UserManager<ApplicationUser> _userManager;

        public PostController(IPostService postService, IAuthorService authorService, IPost_ParticipantService participantService, INotificationService notificationService, UserManager<ApplicationUser> userManager)
        {
            _postService = postService;
            _authorService = authorService;
            _participantService = participantService;
            _notificationService = notificationService;
            this._userManager = userManager;
        }

        [AllowAnonymous]
        public async Task<IActionResult> Index()
        {
            ViewData["UserId"] = _userManager.GetUserId(this.User);
            var allPosts = _postService.GetAllInclude();
            var activePosts = allPosts.Where(p => p.Status == PostStatus.Active).ToList();
            return View(allPosts);
        }

        [AllowAnonymous]
        public async Task<IActionResult> Search(string searchString)
        {
            var allPosts = _postService.GetAllInclude();
            var activePosts = allPosts.Where(p => p.Status == PostStatus.Active).ToList();
            if (!string.IsNullOrEmpty(searchString))
            {
                var matchedResult = activePosts.Where(p => p.Title.ToLower().Contains(searchString.ToLower()) || p.Description.ToLower().Contains(searchString.ToLower())).ToList();
                return View("Index", matchedResult);
            }
            return View("Index", allPosts);
        }

        [AllowAnonymous]
        public async Task<IActionResult> Filter(Tag tag)
        {
            var allPosts = _postService.GetAllInclude();
            var activePosts = allPosts.Where(p => p.Status == PostStatus.Active).ToList();
            var filteredPosts = activePosts.Where(p => p.Tag == tag);
            return View("Index", filteredPosts);
        }

        [Authorize]
        public async Task<IActionResult> Create()
        {
            return View();
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create(Post post)
        {
            if (!ModelState.IsValid)
            {
                return View(post);
            }
            if (post.ExpireTime < DateTime.Now)
            {
                ViewData["WrongExpireTime"] = "Expired Date is incorrect";
                return View(post);
            }

            var user = await _userManager.GetUserAsync(User);
            var author = _authorService.GetById(user.Id);
            if (author == default)
            {
                author = new Author
                {
                    Id = user.Id,
                    Username = user.UserName,
                    Password = user.PasswordHash,
                    FullName = user.Fullname
                };
                _authorService.Add(author);
            }

            post.AuthorId = author.Id;
            _postService.Add(post);
            return RedirectToAction("Index");
        }

        [Authorize]
        public async Task<IActionResult> MyPost()
        {
            var user = await _userManager.GetUserAsync(User);
            var allPosts = _postService.GetAllInclude();
            var myPosts = allPosts.Where(p => p.AuthorId == user.Id);
            ViewData["UserId"] = user.Id;
            return View(myPosts);
        }

        [Authorize]
        public async Task<IActionResult> MyActivity()
        {
            var user = await _userManager.GetUserAsync(User);
            var allPosts = _postService.GetAllInclude();
            var allParticipants = _participantService.GetAll();
            var postParticipants =allParticipants.Where(pp => pp.UserId == user.Id).Select(pp => pp.PostId).ToList();
            var posts = allPosts.Where(p => postParticipants.Contains(p.Id));
            ViewData["UserId"] = user.Id;
            return View(posts);
        }

        [AllowAnonymous]
        public async Task<IActionResult> Detail(int id)
        {
            if (User.Identity.IsAuthenticated)
            {
                var user = await _userManager.GetUserAsync(this.User);
                ViewData["UserId"] = user.Id;
                ViewData["isParticipant"] = _participantService.GetAll().Any(pp => pp.PostId == id && pp.UserId == user.Id);
            }
            var post = _postService.GetByIdInclude(id);
            if (post != default)
            {
                ViewData["Expired Date"] = post.ExpireTime.HasValue ? post.ExpireTime.Value
                .ToString("dddd, dd MMMM yyyy") : "<not available>"; ;
                return View(post);
            }
            return RedirectToAction("NotFound", "Home");
        }

        [Authorize]
        public async Task<IActionResult> Edit(int id)
        {
            var user = await _userManager.GetUserAsync(User);
            var post = _postService.GetById(id);
            if (post != default || post.AuthorId == user.Id || post.Status != PostStatus.Closed)
            {
                return View(post);
            }
            return RedirectToAction("NotFound", "Home");
        }

        [HttpPost]
        public async Task<IActionResult> Edit(int id, Post post)
        {
            var user = await _userManager.GetUserAsync(User);
            if (!ModelState.IsValid)
            {
                return View(post);
            }
            post.AuthorId = user.Id;
            _postService.Update(id, post);
            _postService.Save();
            return Redirect("../detail/" + id);
        }

        [Authorize]
        public async Task<IActionResult> Join(int id)
        {
            var post = _postService.GetById(id);
            if (post != default || post.Status != PostStatus.Closed)
            {
                var user = await _userManager.GetUserAsync(User);
                var participant = new Post_Participant
                {
                    PostId = post.Id,
                    UserId = user.Id
                };
                _participantService.Add(participant);
                return Redirect("../detail/" + post.Id);
            }
            return RedirectToAction("NotFound", "Home");
        }

        [Authorize]
        public async Task<IActionResult> Unjoin(int id)
        {
            var post = _postService.GetById(id);
            var user = await _userManager.GetUserAsync(User);
            var participant = _participantService.GetAll().SingleOrDefault(pp => pp.PostId == id && pp.UserId == user.Id);
            if (participant != default || post != default || post.Status != PostStatus.Closed)
            {
                _participantService.Delete(participant);
                _participantService.Save();
                return Redirect("../detail/" + post.Id);
            }
            return View("NotFound", "Home");
        }

        [Authorize]
        public async void FilterParticipants(Post post)
        {
            var urlLink = "../detail/" + post.Id;
            var PostParticipants = _participantService.GetAll().Where(pp => pp.PostId == post.Id).ToList();
            var diff = PostParticipants.Count() - post.NumberOfParticipants;

            while (diff > 0)
            {
                var lastParticipant = PostParticipants.OrderBy(pp => pp.Id).LastOrDefault();
                _participantService.Delete(lastParticipant);
                PostParticipants.Remove(lastParticipant);
                _notificationService.Send("Sorry", post.Title, urlLink, lastParticipant.UserId);
                diff--;
            }

            foreach (var person in PostParticipants)
            {
                _notificationService.Send("Congrats", post.Title, urlLink, person.UserId);
            }
        }

        [Authorize]
        public async Task<IActionResult> Close(int id)
        {   
            var post = _postService.GetById(id);

            if (post != default || post.Status != PostStatus.Closed)
            {
                FilterParticipants(post);
                post.Status = PostStatus.Closed;
                _postService.Update(id, post);
                _postService.Save();
                return Redirect("../detail/" + post.Id);
            }
            return View("NotFound", "Home");
        }

        [HttpPost]
        public async void CheckPostExpiration()
        {
            // Logic to check if any posts have expired
            DateTime currentTime = DateTime.Now;
            var expiredPosts = _postService.GetAll().Where(p => p.ExpireTime <= currentTime && p.Status == PostStatus.Active).ToList();
            foreach (var post in expiredPosts)
            {
                FilterParticipants(post);
                post.Status = PostStatus.Closed;
                _postService.Update(post.Id, post);
            }
            _postService.Save();
        }
    }
}
