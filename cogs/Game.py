from discord.ext import commands
from discord import app_commands
import discord
from lib import tools
import os

ASSET_SOUNDS = os.path.join(os.path.dirname(__file__), "assets/sounds")

class Game(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.Cog.listener()
    async def on_ready(self):
        await self.bot.tree.sync()
        # print(f'{self.bot.user}의 슬래시 커맨드가 동기화되었습니다.')
    
    
    @app_commands.command(name="러시안룰렛", description="한명이 남을때까지 계속되는 살인게임")
    async def roulette(self, interaction: discord.Interaction):
        channel = interaction.user.voice.channel
        voice=await channel.connect()
        await interaction.channel.send(os.listdir(ASSET_SOUNDS))
        # voice.play(discord.FFmpegPCMAudio(source=f"./sounds/{target}"))

# Cog 등록
async def setup(bot):
    await bot.add_cog(Game(bot))
