import replicate
from dotenv import load_dotenv

load_dotenv()


if __name__ == "__main__":
    output = replicate.run(
        "kacperadach/instant_id:5800644c6258cd2072b8d15c5780ae366aa67d1284c9971b39db1cf3069a88fd",
        input={
            "image": "https://yt-thumbnail-assets.s3.us-east-1.amazonaws.com/images/92d616f2-a5a3-44a3-902c-df566f289e9e.jpg",
            "width": 640,
            "height": 640,
            "prompt": "analog film photo of a man. faded film, desaturated, 35mm photo, grainy, vignette, vintage, Kodachrome, Lomography, stained, highly detailed, found footage, masterpiece, best quality",
            "guidance_scale": 5,
            "negative_prompt": "",
            "ip_adapter_scale": 0.8,
            "num_inference_steps": 30,
            "controlnet_conditioning_scale": 0.8,
        },
    )
    print(output)
