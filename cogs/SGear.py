from discord.ext import commands
from discord import app_commands
import discord
from lib import tools
import os


class slash(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.Cog.listener()
    async def on_ready(self):
        await self.bot.tree.sync()
        # print(f'{self.bot.user}의 슬래시 커맨드가 동기화되었습니다.')

    @app_commands.command(name="aa", description="인사하는 슬래시 커맨드입니다.")
    async def hello(self, interaction: discord.Interaction):
        await interaction.response.send_message("aa!")


# Cog 등록
async def setup(bot):
    await bot.add_cog(slash(bot))
