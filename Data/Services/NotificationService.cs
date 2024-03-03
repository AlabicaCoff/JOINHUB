using Test.Models;

namespace Test.Data.Services
{
    public class NotificationService: INotificationService
    {
        private readonly TestDbContext _context;
        public NotificationService(TestDbContext context)
        {
            _context = context;
        }
        public void Add(Notification notification)
        {
            _context.Notifications.Add(notification);
            _context.SaveChanges();
        }

        public void Delete(Notification notification)
        {
            _context.Notifications.Remove(notification);
            _context.SaveChanges();
        }

        public IEnumerable<Notification> GetAll()
        {
            var result = _context.Notifications.ToList();
            return result;
        }

        public Notification GetById(int id)
        {
            var result = _context.Notifications.SingleOrDefault(n => n.Id == id);
            return result;
        }

        public void Update(int id, Notification notification)
        {
            _context.Notifications.Update(notification);
            _context.SaveChanges();
        }
    }
}
