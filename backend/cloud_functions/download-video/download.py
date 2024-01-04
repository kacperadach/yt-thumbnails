import os
import re
import subprocess
from yt_dlp import YoutubeDL

TMP_DIR = "/tmp"

DEFAULT_YT_DLP_ARGS = {
    "quiet": True,
    "noprogress": True,
    "no_warnings": True,
    "ignoreerrors": False,
    "nocheckcertificate": True,
    "check_formats": False,
    "writeinfojson": False,
    "restrictfilenames": True,
}

DEFAULT_YT_DLP_INFO_ARGS = {
    "simulate": True,
    "skip_download": True,
    "dump_single_json": True,
    "no_color": True,
}


class DownloadHook:
    filename = None

    def get_filename(self, info):
        if not self.filename:
            self.filename = info["filename"]


def _get_closest_available_format(
    formats,
    resolution,
    fps=30,
    ext=None,
    vcodec=None
    # preffered_format_id=None,
):
    try:
        format_ = next(
            (
                format_
                for format_ in formats[::-1]
                if (ext is None or format_.get("ext") == ext)
                and format_.get("height") is not None
                and format_.get("height") <= resolution
                and format_.get("fps") is not None
                and round(format_.get("fps")) <= fps
                and (vcodec is None or vcodec in format_.get("vcodec", ""))
            ),
            None,
        )
        if not format_:
            # if there are no available formats with the same extension,
            # find the extension that maintains the same format_type (video or audio)
            # and return the closest
            format_ = None
            for ft in formats:
                if ft.get("format_note") == "DASH audio" or ft.get("ext") == "mhtml":
                    continue
                if ft.get("height") is not None and ft.get("height") <= resolution:
                    format_ = ft
                    break

        return format_
    except Exception as exc:
        print(exc)
        return None


def download_twitch_stream_info(url: str):
    with YoutubeDL({**DEFAULT_YT_DLP_ARGS, **DEFAULT_YT_DLP_INFO_ARGS}) as ydl:
        return ydl.extract_info(url, download=False)


def download_twitch_vod(url, resolution=720, info=None):
    if not info:
        info = download_twitch_stream_info(url)

    print([f.get("height") for f in info["formats"]])
    format_ = _get_closest_available_format(
        info["formats"],
        resolution=resolution,
        fps=30,
    )
    print(format_)
    twitch_download = DownloadHook()
    with YoutubeDL(
        {
            "progress_hooks": [twitch_download.get_filename],
            "paths": {"home": TMP_DIR},
        }
    ) as ydl:
        ydl.download(url)

    return twitch_download.filename


def download_youtube_info(url):
    ydl_opts = {
        **DEFAULT_YT_DLP_ARGS,
        **DEFAULT_YT_DLP_INFO_ARGS,
        "no_playlist": True,
        "default_search": "ytsearch",
        "extractor_args": {
            "youtube:search_max_results": 1000,
        },
    }
    with YoutubeDL(ydl_opts) as ydl:
        return ydl.extract_info(url, download=False)


def download_youtube_vod(url, resolution=720, info=None):
    if not info:
        info = download_youtube_info(url)
    print([f.get("height") for f in info["formats"]])
    format_ = _get_closest_available_format(
        info["formats"],
        resolution=resolution,
        fps=30,
    )
    print(format_)
    youtube_download = DownloadHook()
    with YoutubeDL(
        {"progress_hooks": [youtube_download.get_filename], "paths": {"home": TMP_DIR}}
    ) as ydl:
        ydl.download(url)

    return re.sub(r"\.f\d+", "", youtube_download.filename)


def extract_clip(path, start, end):
    file_extension = os.path.splitext(path)[1]
    output_path = path.rsplit(".", 1)[0] + "_trimmed" + file_extension
    try:
        if file_extension == ".mp4":
            command = [
                "ffmpeg",
                "-i",
                path,  # Input file
                "-ss",
                str(start),  # Start time
                "-to",
                str(end),  # End time
                "-c",
                "copy",  # Copy the stream directly, no re-encoding
                output_path,  # Output file
            ]
        elif file_extension == ".webm":
            command = [
                "ffmpeg",
                "-i",
                path,  # Input file
                "-ss",
                str(start),  # Start time
                "-to",
                str(end),  # End time
                "-c:v",
                "libvpx",  # Video codec for WebM
                "-c:a",
                "libvorbis",  # Audio codec for WebM
                output_path,  # Output file
            ]
        else:
            raise ValueError("Unsupported file format")

        # Execute the command
        subprocess.run(command, check=True)
        print(f"Clip extracted successfully to {output_path}")
    except subprocess.CalledProcessError as e:
        print(f"An error occurred: {e}")
    except ValueError as e:
        print(e)


if __name__ == "__main__":
    extract_clip("nicki.webm", 401, 402)
    # download_youtube_vod("https://www.youtube.com/watch?v=LPDTuHcua0o")
    # print(
    #     download_youtube_info("https://www.youtube.com/watch?v=LPDTuHcua0o").get(
    #         "thumbnail"
    #     )
    # )
