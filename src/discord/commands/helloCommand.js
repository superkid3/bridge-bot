const { Embed } = require("../../contracts/embedHandler.js");

module.exports = {
  name: "hello",
  description: "Replies with a friendly greeting.",

  execute: async (interaction) => {
    const embed = new Embed()
      .setTitle("👋 Hello!")
      .setDescription(`Hi <@${interaction.user.id}> — I'm up and running!`);

    // If you deferred the reply earlier, use followUp. Otherwise you can reply.
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({ embeds: [embed] });
    } else {
      await interaction.reply({ embeds: [embed] });
    }
  },
};
