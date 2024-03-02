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
using Test.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Test.Controllers
{
    public class PostController : Controller
    {
        private readonly TestDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public PostController(TestDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            this._userManager = userManager;
        }

        [AllowAnonymous]
        public async Task<IActionResult> Index()
        {
            ViewData["UserId"] = _userManager.GetUserId(this.User);
            var data = await _context.Posts.Where(p => p.Status == PostStatus.Active).Include(a => a.Author).ToListAsync();
            return View(data);
        }

        [AllowAnonymous]
        public async Task<IActionResult> Search(string searchString)
        {
            var allPosts = await _context.Posts.Where(p => p.Status == PostStatus.Active).ToListAsync();
            if (!string.IsNullOrEmpty(searchString))
            {
                var matchedResult = allPosts.Where(p => p.Title.ToLower().Contains(searchString.ToLower()) || p.Description.ToLower().Contains(searchString.ToLower())).ToList();
                return View("Index", matchedResult);
            }
            return View("Index", allPosts);
        }

        [AllowAnonymous]
        public async Task<IActionResult> Filter(Tag tag)
        {
            var allPosts = await _context.Posts.Where(p => p.Status == PostStatus.Active).ToListAsync();
            var filteredPosts = allPosts.Where(p => p.Tag == tag);
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

            var user = await _userManager.GetUserAsync(User);
            var author = await _context.Authors.SingleOrDefaultAsync(a => a.Id == user.Id);
            if (author == default)
            {
                author = new Author
                {
                    Id = user.Id,
                    Username = user.UserName,
                    Password = user.PasswordHash,
                    FullName = user.Fullname
                };
                _context.Authors.Add(author);
            }

            post.AuthorId = author.Id;
            _context.Posts.Add(post);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        [Authorize]
        public async Task<IActionResult> MyPost()
        {
            var user = await _userManager.GetUserAsync(User);
            var allPosts = await _context.Posts.ToListAsync();
            var posts = allPosts.Where(p => p.AuthorId == user.Id);
            ViewData["UserId"] = user.Id;
            return View(posts);
        }

        [Authorize]
        public async Task<IActionResult> MyActivity()
        {
            var user = await _userManager.GetUserAsync(User);
            var allPosts = await _context.Posts.ToListAsync();
            var post_participants = await _context.Post_Participants.Where(pp => pp.UserId == user.Id).Select(pp => pp.PostId).ToListAsync();
            var posts = allPosts.Where(p => post_participants.Contains(p.Id));
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
                ViewData["isParticipant"] = _context.Post_Participants.Any(pp => pp.PostId == id && pp.UserId == user.Id);
            }
            var post = await _context.Posts.Include(a => a.Author).Include(pp => pp.Post_Participants).ThenInclude(u => u.ApplicationUser).SingleOrDefaultAsync(p => p.Id == id);
            if (post == default)
            {
                return RedirectToAction("NotFound", "Home");
            }

            ViewData["Expired Date"] = post.ExpireTime.HasValue ? post.ExpireTime.Value
                .ToString("dddd, dd MMMM yyyy") : "<not available>"; ;
            return View(post);
        }

        [Authorize]
        public async Task<IActionResult> Edit(int id)
        {
            var user = await _userManager.GetUserAsync(User);
            var post = await _context.Posts.SingleOrDefaultAsync(p => p.Id == id);
            if (post == default || post.AuthorId != user.Id || post.Status == PostStatus.Closed)
            {
                return RedirectToAction("NotFound", "Home");
            }
            return View(post);
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
            _context.Posts.Update(post);
            await _context.SaveChangesAsync();
            return Redirect("../detail/" + id);
        }

        [Authorize]
        public async Task<IActionResult> Join(int id)
        {
            var post = _context.Posts.SingleOrDefault(p => p.Id == id);
            if (post == default || post.Status == PostStatus.Closed)
            {
                return RedirectToAction("NotFound", "Home");
            }
            var user = await _userManager.GetUserAsync(User);
            var participant = new Post_Participant
            {
                PostId = post.Id,
                UserId = user.Id
            };
            _context.Post_Participants.Add(participant);
            await _context.SaveChangesAsync();
            return Redirect("../detail/" + post.Id);
        }

        [Authorize]
        public async Task<IActionResult> Unjoin(int id)
        {
            var post = _context.Posts.SingleOrDefault(p => p.Id == id);
            var user = await _userManager.GetUserAsync(User);
            var participant = await _context.Post_Participants.SingleOrDefaultAsync(pp => pp.PostId == id && pp.UserId == user.Id);
            if (participant == default || post == default || post.Status == PostStatus.Closed)
            {
                return View("NotFound", "Home");
            }
            _context.Post_Participants.Remove(participant);
            await _context.SaveChangesAsync();
            return Redirect("../detail/" + post.Id);
        }

        [Authorize]
        public async Task<IActionResult> Close(int id)
        {   
            var user = await _userManager.GetUserAsync(User);
            var post = _context.Posts.SingleOrDefault(p => p.Id == id);
            if (post == default || post.Status == PostStatus.Closed)
            {
                return View("NotFound", "Home");
            }

            var AllParticipants = _context.Post_Participants.ToList();
            var diff = AllParticipants.Count() - post.NumberOfParticipants;
           
            while (diff > 0) 
            {
                var lastParticipant = AllParticipants.LastOrDefault();
                _context.Post_Participants.Remove(lastParticipant);
                diff--;
            }
    
            post.Status = PostStatus.Closed;
            _context.Update(post);
            await _context.SaveChangesAsync();
            return Redirect("../detail/" + post.Id);
        }

        [HttpPost]
        public async Task<ActionResult> CheckPostExpiration()
        {
            // Logic to check if any posts have expired
            DateTime currentTime = DateTime.Now;
            var expiredPosts = _context.Posts.Where(p => p.ExpireTime <= currentTime).ToList();

            foreach (var post in expiredPosts)
            {
                post.Status = PostStatus.Closed;
            }
            
            await _context.SaveChangesAsync();
            return Json(expiredPosts);
        }
    }
}
