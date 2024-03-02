using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json.Linq;
using Test.Areas.Identity.Data;
using Test.Data;
using Test.Data.Enum;
using Test.Models;

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
            var data = await _context.Posts.ToListAsync();
            return View(data);
        }

        [AllowAnonymous]
        public async Task<IActionResult> Search(string searchString)
        {
            var allPosts = await _context.Posts.ToListAsync();
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
            var filteredPosts = await _context.Posts.Where(p => p.Tag == tag).ToListAsync();
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
            var author = new Author
            {
                Id = user.Id,
                Username = user.UserName,
                Password = user.PasswordHash,
                FullName = user.Fullname
            };
            _context.Authors.Add(author);
            post.AuthorId = author.Id;
            _context.Posts.Add(post);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        [Authorize]
        public IActionResult MyPost()
        {
            return View();
        }

        [Authorize]
        public IActionResult MyActivity()
        {
            return View();
        }

        public async Task<IActionResult> Detail(int id)
        {
            var user = await _userManager.GetUserAsync(this.User);
            var data = await _context.Posts.Include(a => a.Author).Include(pp => pp.Post_Participants).ThenInclude(u => u.ApplicationUser).SingleOrDefaultAsync(p => p.Id == id);
            if (data == default)
            {
                return RedirectToAction("NotFound", "Home");
            }
            ViewData["UserId"] = user.Id;
            ViewData["isParticipant"] = _context.Post_Participants.Any(pp => pp.PostId == data.Id && pp.UserId == user.Id);
            ViewData["Expired Date"] = data.ExpireTime.HasValue? data.ExpireTime.Value
                .ToString("dddd, dd MMMM yyyy") : "<not available>"; ;
            return View(data);
        }

        public async Task<IActionResult> Join(int id)
        {
            var user = await _userManager.GetUserAsync(User);
            var participant = new Post_Participant
            {
                PostId = id,
                UserId = user.Id
            };
            _context.Post_Participants.Add(participant);
            await _context.SaveChangesAsync();
            return Redirect("../detail/" + id);
        }

        public async Task<IActionResult> Unjoin(int id)
        {
            var user = await _userManager.GetUserAsync(User);
            var participant = _context.Post_Participants.Single(pp => pp.PostId == id && pp.UserId == user.Id);
            if (participant != null)
            {
                _context.Post_Participants.Remove(participant);
                await _context.SaveChangesAsync();
                return Redirect("../detail/" + id);
            }
            return View("NotFound", "Home");
        }
    }
}
