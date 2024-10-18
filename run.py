import discord, json
from discord.ext import commands

bot = commands.Bot(command_prefix='!', intents=discord.Intents.default())

with open('token.json', 'r') as file: 
    token = json.load(file)['token']

@bot.slash_command(name="test", description="Say hello!")
async def hello(ctx):
    await ctx.respond("test")

@bot.event
async def on_ready():
    print(f"{bot.user.name}가 로그인했습니다!")

# 봇 토큰으로 실행
bot.run(token)