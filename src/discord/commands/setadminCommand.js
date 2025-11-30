const { SuccessEmbed, ErrorEmbed } = require("../../contracts/embedHandler.js");
const serverSettings = require("../serverSettings.js");

module.exports = {
  name: "setadmin",
  description: "Sets the admin role for this server.",
  options: [
    {
      name: "role",
      description: "Role to mark as admin",
      type: 8,
      required: true
    }
  ],

  execute: async (interaction) => {
    // Permission check: require Manage Guild or Administrator if available
    try {
      if (interaction.member && interaction.member.permissions) {
        const perms = interaction.member.permissions;
        // prefer string flag, fall back gracefully if API differs
        const hasManage = typeof perms.has === "function" && (perms.has("MANAGE_GUILD") || perms.has("Administrator") || perms.has("ADMINISTRATOR"));
        if (!hasManage) {
            const err = new ErrorEmbed("You need the Manage Server permission to run this command.");
            await interaction.followUp({ embeds: [err], ephemeral: true });
          return;
        }
      }
    } catch (e) {
      // ignore permission check failures and allow the command to continue
    }

    const role = interaction.options.getRole("role");
    // interaction.options.getRole can return null in some edge cases; also allow passing role id/string
    let resolvedRole = role;
    try {
      if (!resolvedRole && interaction.options && interaction.options.data && interaction.options.data.length > 0) {
        const raw = interaction.options.data[0];
        const maybeId = raw.value ?? raw.role?.id ?? raw.role?.guild ?? null;
        if (maybeId) {
          resolvedRole = interaction.guild.roles.cache.get(maybeId) ?? null;
        }
      }
    } catch (e) {
      // ignore
    }

    if (!resolvedRole) {
      const err = new ErrorEmbed("Could not resolve the role. Make sure to choose a valid role (or @everyone). If using @everyone, select it explicitly.");
      await interaction.followUp({ embeds: [err], ephemeral: true });
      return;
    }

    serverSettings.setAdminRole(interaction.guildId || interaction.guild?.id, resolvedRole.id);

    const embed = new SuccessEmbed(`Set ${resolvedRole.name} as the admin role for this server.`);
    await interaction.followUp({ embeds: [embed] });
  }
};
