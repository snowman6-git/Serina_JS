from discord.ext import commands

class slash(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.slash_command(name="테스트", description="Say hello!")
    async def hello(self, ctx):
        await ctx.respond("테스트코드 from cogs")

# Cog 등록
def setup(bot):
    bot.add_cog(slash(bot))
