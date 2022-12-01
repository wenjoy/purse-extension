type ModalProps = {
  title?: string;
  content?: string[];
  visible: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
};
const Modal = ({ title, content, visible, onClose, onConfirm }: ModalProps) => {
  const rejectHandler = () => {
    onClose?.();
  };
  const approveHandler = () => {
    onConfirm?.();
  };

  return visible ? (
    <div className="bg-gray-400 absolute top-0 left-0 w-full h-full flex justify-center items-center">
      <div className="bg-white rounded-lg h-96 w-64 flex flex-col">
        <h1 className="text-center px-2 mb-3">{title ?? "Title"}</h1>
        <div className="flex-1 space-y-2 p-2">
          {content?.map((text) => (
            <p key={text} className="break-all">
              {text}
            </p>
          ))}
        </div>
        <div className="flex justify-around justify-self-end h-12 bg-stone-400 p-2 rounded-b-lg">
          <button className="btn-dark" onClick={rejectHandler}>
            Reject
          </button>
          <button className="btn" onClick={approveHandler}>
            Approve
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default Modal;
