using System.Text.Json.Serialization;

namespace Test.Data.Enum
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum Tag
    {
        Gaming,
        Sports,
        Movies,
        Anime,
        Arts,
        Animals,
        Music,
        Travel,
        Food
    }
}
