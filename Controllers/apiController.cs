using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Test.Areas.Identity.Data;
using Test.Data.Services;
using System.Text.Json;


namespace Test.Controllers {
    public class apiController(IPostService post, IAuthorService author, IPost_ParticipantService participant, INotificationService notification, UserManager<ApplicationUser> userManager) : Controller {
        private readonly IPostService _post = post;
        private readonly IAuthorService _author = author;
        private readonly IPost_ParticipantService _participant = participant;
        private readonly INotificationService _notification = notification;
        private readonly UserManager<ApplicationUser> _userManager = userManager;

        public JsonResult post(int id) {
            var post = _post.GetById(id);
            return Json(post);
        }

        private JsonResult manifest(IEnumerable<Models.Post> posts) {
            var url = Url.Action(nameof(this.post));

            var IDs = posts
                .Select(p => p.Id)
                .Select(id => $"{url}/{id}");
            
            return Json(IDs);
        }

        [Authorize]
        public JsonResult ActivityOf(string userid) {
            var allPosts = _post.GetAllInclude();

            var postParticipants = _participant.GetAll()
                .Where(pp => pp.UserId == userid)
                .Select(pp => pp.PostId)
                .ToList();

            var posts = allPosts
                .Where(p => postParticipants.Contains(p.Id));

            return manifest(posts);
        }

        [Authorize]
        public JsonResult PostOf(string userid) {
            var allPosts = _post.GetAllInclude();

            var posts = allPosts
                .Where(p => p.AuthorId == userid);

            return manifest(posts);
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