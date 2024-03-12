using Microsoft.AspNetCore.Mvc;
using Test.record;

namespace Test.ViewComponents {
    public class PostListViewComponent: ViewComponent {
        public async Task<IViewComponentResult> InvokeAsync(string userID, string url) {
            return View(new PLdata(userID, url));
        }
    }
}