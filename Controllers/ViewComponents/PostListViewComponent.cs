using Microsoft.AspNetCore.Mvc;
using Test.Models;

namespace Test.ViewComponents {
    public class PostListViewComponent: ViewComponent {
        public async Task<IViewComponentResult> InvokeAsync(IEnumerable<Post> posts) {
            return View(posts);
        }
    }
}