import { v4 as uuidv4 } from "uuid";
import { ContextMenu } from "@radix-ui/themes";
import {
  editingThumbnailId,
  selectedAssetId,
  thumbnails,
} from "../../lib/signals";
import { Thumbnail } from "../../lib/types";
import { getOperatingSystem } from "../../lib/utils";

interface AssetContextMenuProps {
  assetId: string;
  children: React.ReactNode;
  enabled: boolean;
}

export default function AssetContextMenu(props: AssetContextMenuProps) {
  const { assetId, children, enabled } = props;

  const osKey = getOperatingSystem() === "MacOS" ? "⌘" : "Ctrl";

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger
        className="trigger"
        style={{
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      >
        {children}
      </ContextMenu.Trigger>
      {enabled && (
        <ContextMenu.Content>
          {selectedAssetId.value !== assetId && (
            <ContextMenu.Item>Edit</ContextMenu.Item>
          )}
          <ContextMenu.Item
            shortcut={`${osKey} D`}
            onSelect={() => {
              thumbnails.value = thumbnails.value.map((t) => {
                if (t.id !== editingThumbnailId.value) {
                  return t;
                }

                const copiedAsset = t.assets.find((a) => a.id === assetId);

                const newAsset = {
                  ...copiedAsset,
                  id: uuidv4(),
                  x: (copiedAsset?.x || 0) + 1,
                  y: (copiedAsset?.y || 0) + 1,
                };

                selectedAssetId.value = newAsset.id;

                return {
                  ...t,
                  assets: [...t.assets, newAsset],
                } as Thumbnail;
              });
            }}
          >
            Duplicate
          </ContextMenu.Item>
          <ContextMenu.Separator />

          <ContextMenu.Item
            // shortcut={`${osKey} Shift ↑`}
            onSelect={() => {
              thumbnails.value = thumbnails.value.map((t) => {
                if (t.id !== editingThumbnailId.value) {
                  return t;
                }

                const maxZIndex = t.assets.reduce((acc, asset) => {
                  return Math.max(acc, asset.zIndex);
                }, 0);

                const newAssets = t.assets.map((a) => {
                  if (a.id === assetId) {
                    return {
                      ...a,
                      zIndex: maxZIndex + 1,
                    };
                  }

                  return a;
                });

                return {
                  ...t,
                  assets: newAssets,
                } as Thumbnail;
              });
            }}
          >
            Move to Front
          </ContextMenu.Item>
          <ContextMenu.Item
            // shortcut={`${osKey} Shift ↓`}
            onSelect={() => {
              thumbnails.value = thumbnails.value.map((t) => {
                if (t.id !== editingThumbnailId.value) {
                  return t;
                }

                let minZIndex = t.assets.reduce((acc, asset) => {
                  return Math.min(acc, asset.zIndex);
                }, 0);

                let newAssets;
                if (minZIndex - 1 < 0) {
                  newAssets = t.assets.map((a) => {
                    if (a.id === assetId) {
                      return {
                        ...a,
                        zIndex: 0,
                      };
                    } else {
                      return {
                        ...a,
                        zIndex: a.zIndex + 1,
                      };
                    }

                    return a;
                  });
                } else {
                  newAssets = t.assets.map((a) => {
                    if (a.id === assetId) {
                      return {
                        ...a,
                        zIndex: minZIndex - 1,
                      };
                    }

                    return a;
                  });
                }

                return {
                  ...t,
                  assets: newAssets,
                } as Thumbnail;
              });
            }}
          >
            Move to Back
          </ContextMenu.Item>

          <ContextMenu.Separator />
          <ContextMenu.Item
            shortcut={`${osKey} ⌫`}
            color="red"
            onSelect={() => {
              thumbnails.value = thumbnails.value.map((t) => {
                if (t.id !== editingThumbnailId.value) {
                  return t;
                }

                return {
                  ...t,
                  assets: t.assets.filter((a) => {
                    return a.id !== assetId;
                  }),
                };
              });
            }}
          >
            Delete
          </ContextMenu.Item>
        </ContextMenu.Content>
      )}
    </ContextMenu.Root>
  );
}
