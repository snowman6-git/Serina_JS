import os

async def cogs(bot, addon):
    module = f"cogs.{addon}"
    try:
        bot.load_extension(module)
        print(f"\033[32m{addon}\033[0m is \033[32mOK\033[0m!")
    except Exception as E:
        print(f"\033[31m{addon}\033[0m is \033[31mERROR\033[0m!\n{E}")
        print("="*30)

async def bootup(bot, COGS_FOLDER):
    for filename in os.listdir(COGS_FOLDER):
        if filename.endswith(".py"):
            await cogs(bot, filename[:-3])
