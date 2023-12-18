from transparent_background import Remover
from PIL import Image


remover = Remover()  # default setting


def make_background_transparent(image_path):
    img = Image.open(image_path).convert("RGB")  # read image
    out = remover.process(img)  # default setting - transparent background
    out.save("output.png")  # save result
    print("Saved output.png")


if __name__ == "__main__":
    make_background_transparent("headshot.jpg")
