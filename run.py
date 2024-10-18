import discord, json, os, asyncio
from discord.ext import commands
from lib import tools

COGS_FOLDER = os.path.join(os.path.dirname(__file__), "cogs") #__file__ < 현재 파이썬 파일
bot = commands.Bot(command_prefix="!", intents=discord.Intents.all())

with open('token.json', 'r') as file: 
    token = json.load(file)['token']

@bot.slash_command(name="test", description="Say hello!")
async def hello(ctx):
    await ctx.respond("test")

@bot.event
async def on_ready(): print(f"{bot.user.name} is ready!")

async def main():
    async with bot:
        await tools.bootup(bot, COGS_FOLDER)
        await bot.start(token) 

if __name__ == "__main__":
    asyncio.run(main())