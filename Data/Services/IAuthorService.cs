using Test.Models;

namespace Test.Data.Services
{
    public interface IAuthorService
    {
        IEnumerable<Author> GetAll();
        Author GetById(string id);
        void Add(Author author);
        void Update(string id, Author author);
        void Delete(Author author);
    }
}
