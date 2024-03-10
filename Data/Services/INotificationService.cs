using Test.Models;

namespace Test.Data.Services
{
    public interface INotificationService
    {
        IEnumerable<Notification> GetAll();
        Notification GetById(int id);
        Notification GetByLink(string link);
        void Add(Notification notification);
        void Update(int id, Notification notification);
        void Delete(Notification notification);
        void Save();
        void Send(string title, string postTitle, string link, string userId);
        bool CheckUnread(string userId);
    }
}
