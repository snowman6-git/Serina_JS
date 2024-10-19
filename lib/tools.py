import os

# async def cogs(bot, addon):
#     module = f"cogs.{addon}"
#     try:
#         try: 
#             bot.unload_extension(module)
#             print(f"\033[93m{addon}\033[0m is \033[32munloaded\033[0m!")
#         except: bot.load_extension(module)
#         print(f"\033[32m{addon}\033[0m is \033[32mOK\033[0m!")
#     except Exception as E:
#         print(f"\033[31m{addon}\033[0m is \033[31mERROR\033[0m!\n{E}")
#         print("="*30)

class Cogs: #잠 깨면 최적화 해둬라
    def __init__(self, bot):
        self.bot = bot
    async def load(self, target):
        try:
            await self.bot.load_extension(f"cogs.{target}")
            print(f"\033[32m{target}\033[0m is \033[32mOK\033[0m!")
            return "pass"
        except Exception as E:
            print(f"\033[31m{f"{target}"}\033[0m is \033[31mERROR\033[0m!\n{E}")
            print("="*30)
            return E
    async def reload(self, target):
        try:
            # await self.bot.reload_extension(f"cogs.{target}")
            await self.bot.unload_extension(f"cogs.{target}")
            await self.bot.load_extension(f"cogs.{target}")
            # await self.bot.tree.sync()
            print(f"\033[32m{f"{target}"}\033[0m is \033[32mreloaded!\033[0m!")
            return "pass"
        except Exception as E:
            print(f"\033[31m{f"{target}"}\033[0m is \033[31mERROR\033[0m!\n{E}")
            print("="*30)
            return E
    async def unload(self, target):
        try:
            await self.bot.unload_extension(f"cogs.{target}")
            print(f"\033[90m{f"{target}"}\033[0m is \033[90munloaded\033[0m!")
            return "pass"
        except Exception as E:
            print(f"\033[31m{f"{target}"}\033[0m is \033[31mERROR\033[0m!\n{E}")
            print("="*30)
            return E
    @staticmethod
    def find_and_load():
        return Cogs()
    

def addon_list():
    addons = []
    target = os.listdir("./cogs")
    for i in range(len(target)):
        if target[i].endswith(".py"): addons.append(target[i].split(".")[0])
    return  addons

async def bootup(bot, COGS_FOLDER):
    
    for filename in os.listdir(COGS_FOLDER):
        if filename.endswith(".py"):
            cogs = Cogs(bot=bot)
            await cogs.load(filename[:-3])
