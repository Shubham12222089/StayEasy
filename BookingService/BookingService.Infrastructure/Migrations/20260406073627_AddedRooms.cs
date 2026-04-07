using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookingService.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddedRooms : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "HotelId",
                table: "CartItems",
                newName: "RoomId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "RoomId",
                table: "CartItems",
                newName: "HotelId");
        }
    }
}
