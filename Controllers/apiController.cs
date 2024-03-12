using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Test.Areas.Identity.Data;
using Test.Data.Services;
using Test.Data.Enum;


namespace Test.Controllers {
    public class apiController(IPostService post, IAuthorService author, IPost_ParticipantService participant, INotificationService notification, UserManager<ApplicationUser> userManager) : Controller {
        private readonly IPostService _post = post;
        private readonly IAuthorService _author = author;
        private readonly IPost_ParticipantService _participant = participant;
        private readonly INotificationService _notification = notification;
        private readonly UserManager<ApplicationUser> _userManager = userManager;

        public JsonResult post(int id) {
            var post = _post.GetByIdInclude(id);
            return Json(post);
        }

        public JsonResult filter(int id) {
            var allPosts = _post.GetAllInclude();
            var activePosts = allPosts.Where(p => p.Status == PostStatus.Active).ToList();
            var filtered = activePosts.Where(p => (int) p.Tag == id);

            return Json(manifest(filtered));
        }

        public JsonResult all() {
            var allPosts = _post.GetAllInclude();

            return Json(manifest(allPosts));
        }

        private string[] manifest(IEnumerable<Models.Post> posts) {
            var url = Url.Action(nameof(this.post));
            var IDs = posts
                .Select(p => p.Id)
                .Select(id => $"{url}/{id}")
                .ToArray();
            
            return IDs;
        }

        [Authorize]
        public async Task<JsonResult> myactivity() {
            var user = await _userManager.GetUserAsync(User);

            var postParticipants = _participant.GetAll()
                .Where(pp => pp.UserId == user.Id)
                .Select(pp => pp.PostId)
                .ToList();

            var posts = _post.GetAllInclude()
                .Where(p => postParticipants.Contains(p.Id));

            return Json(manifest(posts));
        }

        [Authorize]
        public async Task<JsonResult> mypost() {
            var user = await _userManager.GetUserAsync(User);            
            var posts = _post.GetAllInclude()
                .Where(p => p.AuthorId == user.Id);

            return Json(manifest(posts));
        }

        

    }
}
/*
    https://learn.microsoft.com/aspnet/core/mvc/controllers/routing
    https://learn.microsoft.com/aspnet/core/tutorials/first-mvc-app/adding-controller
    https://learn.microsoft.com/en-us/dotnet/standard/serialization/system-text-json/overview
    https://learn.microsoft.com/en-us/dotnet/api/system.text.json.jsonserializeroptions?view=net-8.0
    https://learn.microsoft.com/en-us/dotnet/standard/serialization/system-text-json/ignore-properties
*/