using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Test.Areas.Identity.Data;
using Test.Data;
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

        public async Task<IActionResult> Index()
        {
            ViewData["UserId"] = _userManager.GetUserId(this.User);

            var data = await _context.Posts.ToListAsync();
            return View(data);
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
            var data = _context.Posts.SingleOrDefaultAsync(p => p.Id == id);
            return View(data);
        }
    }
}
