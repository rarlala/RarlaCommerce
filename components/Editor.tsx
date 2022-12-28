import styled from "@emotion/styled";
import dynamic from "next/dynamic";
import { Dispatch, SetStateAction } from "react";
import { EditorProps, EditorState } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Button from "./Button";

const Editor = dynamic<EditorProps>(
  () => import("react-draft-wysiwyg").then((module) => module.Editor),
  {
    ssr: false,
  }
);

export default function CustomEditor({
  editorState,
  readonly = false,
  onSave,
  onEditorStateChange,
}: {
  editorState: EditorState;
  readonly: boolean;
  onSave?: () => void;
  onEditorStateChange?: Dispatch<SetStateAction<EditorState | undefined>>;
}) {
  return (
    <Wrapper>
      <Editor
        readOnly={readonly}
        editorState={editorState}
        toolbarHidden={readonly}
        wrapperClassName="wrapper-class"
        toolbarClassName="editorToolbar-hidden"
        editorClassName="editor-class"
        toolbar={{
          options: ["inline", "list", "textAlign", "link"],
        }}
        localization={{ locale: "ko" }}
        onEditorStateChange={onEditorStateChange}
      />
      {!readonly && <Button onClick={onSave}>Save</Button>}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 16px;
`;
