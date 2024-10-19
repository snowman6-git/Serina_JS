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

# Cog 등록
async def setup(bot):
    await bot.add_cog(slash(bot))
