using Test.Models;

namespace Test.Data.Services
{
    public interface IPostService
    {
        IEnumerable<Post> GetAll();
        IEnumerable<Post> GetAllInclude();
        Post GetById(int id);
        Post GetByIdInclude(int id);
        void Add(Post post);
        void Update(int id, Post post);
        void Delete(Post post);
        Task Save();
    }
}
