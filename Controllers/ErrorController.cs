using Microsoft.AspNetCore.Mvc;

namespace Test.Controllers
{
    public class ErrorController : Controller
    {
        public IActionResult NotFoundPage()
        {
            return View();
        }
    }
}
