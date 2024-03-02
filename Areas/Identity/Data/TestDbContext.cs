using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;
using Test.Areas.Identity.Data;
using Test.Models;

namespace Test.Data;

public class TestDbContext : IdentityDbContext<ApplicationUser>
{
    public TestDbContext(DbContextOptions<TestDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<Post_Participant>().HasKey(pp => new
        {
            pp.Id,
            pp.PostId,
            pp.UserId
        });

        builder.Entity<Post_Participant>().Property(pp => pp.Id).ValueGeneratedOnAdd();
        builder.Entity<Post_Participant>().HasOne(p => p.Post).WithMany(pp => pp.Post_Participants).HasForeignKey(p => p.PostId);
        builder.Entity<Post_Participant>().HasOne(p => p.ApplicationUser).WithMany(pp => pp.Post_Participants).HasForeignKey(p => p.UserId);

        base.OnModelCreating(builder);
    }

    public DbSet<Post> Posts { get; set; }
    public DbSet<Author> Authors { get; set; }
    public DbSet<Post_Participant> Post_Participants { get; set; }
    public DbSet<Notification> Notifications { get; set; }
}
