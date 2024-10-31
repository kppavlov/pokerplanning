import { Share } from "../../../components/icons/share.tsx";
import { useRoomState } from "../../../store/room-ctx";

export const ShareLink = () => {
  const { actions, values } = useRoomState();
  const { setLinkCopied } = actions;
  const { linkCopied } = values;
  const handleCopyUrl = async () => {
    await window.navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
  };

  return (
    <h3
      onClick={handleCopyUrl}
      className={`copy-link-header ${
        linkCopied ? "copy-link-header-clicked" : ""
      }`}
    >
      Copy link{" "}
      <Share
        width={16}
        height={16}
        viewBox="0 0 30 30"
        fill={linkCopied ? "limegreen" : "#333d51"}
      />
    </h3>
  );
};
