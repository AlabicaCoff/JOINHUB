using Test.Models;

namespace Test.Data.Services
{
    public interface IPost_ParticipantService
    {
        IEnumerable<Post_Participant> GetAll();
        Post_Participant GetById(int id);
        void Add(Post_Participant post_participant);
        void Update(int id, Post_Participant post_participant);
        void Delete(Post_Participant post_participant);
    }
}
