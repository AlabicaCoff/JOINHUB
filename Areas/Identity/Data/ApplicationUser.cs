using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Test.Models;

namespace Test.Areas.Identity.Data;

// Add profile data for application users by adding properties to the  class
public class ApplicationUser: IdentityUser
{
    [PersonalData]
    [Column(TypeName = "nvarchar(100)")]
    public string Fullname { get; set; }

    // Relationships
    public List<Post_Participant>? Post_Participants { get; set; }
    public List<Notification>? Notifications { get; set; }
}

