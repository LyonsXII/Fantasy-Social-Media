import styled from 'styled-components';
import { useEffect } from 'react';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import type { InitialConfigType } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalCustomTextActions } from './TextEditorCustomTextActions.tsx'

import './Lexical.css';

const StyledMainContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const StyledEditableContent = styled(ContentEditable)<{ $showMenu?: boolean, $minimalist?: boolean }>`
  position: relative;
  height: 100%;
  width: 100%;
  padding: 0.6rem;
  font-size: 1rem;
  border: ${({ $showMenu, $minimalist }) => {
    if ($showMenu) return "1px solid black";
    else if ($minimalist && $showMenu) return "1px solid grey";
    else return "none";
  }};
  border-radius: ${({ $minimalist }) => ($minimalist ? "0" : "0 0 1.2rem 1.2rem")};
  overflow-y: auto;
`;

const StyledPlaceholder = styled.div`
  position: absolute;
  left: 0.6rem;
  top: 60px;
  color: rgba(0,0,0,0.8);
`;

const StyledEditorContainer = styled.div<{ $minimalist?: boolean }>`
  display: flex;
  flex-direction: ${({ $minimalist }) =>
    $minimalist ? "column-reverse" : "column"};
  height: 100%;
  width: 100%;
`;

const CustomPlaceholder = () => {
    return (
      <StyledPlaceholder>
          Enter some text...
      </StyledPlaceholder>
    )
};

const EditablePlugin = ({ editable }: { editable: boolean }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.setEditable(editable);
  }, [editor, editable]);

  return null;
};

type TextEditorProps = {
  showMenu?: boolean;
  closeMenu: (value: boolean) => void;  
  minimalist?: boolean;
  content?: string;
  createPost?: (postData: any) => Promise<void>;
  openPicker?: () => void;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef?: React.RefObject<HTMLInputElement | null>;
  attachmentName?: string;
};

const TextEditor = (props : TextEditorProps) => {
  const { showMenu, content, minimalist, closeMenu } = props;

  const lexicalConfig: InitialConfigType = {
      namespace: showMenu ? "Create post text editor" : "Post viewer",
      theme: {
        text: {
        bold: "text-bold",
        italic: "text-italic",
        underline: "text-underline",
        code: 'text-code',
        highlight: 'text-highlight',
        strikethrough: 'text-strikethrough',
        subscript: 'text-subscript',
        superscript: 'text-superscript',
        },
      },
      editorState: content && content.trim() !== "" ? content : undefined,
      editable: showMenu,
      onError: (e) => {
          console.log('ERROR:', e)
      }
  }

  const CustomContent = (
    <StyledEditableContent $showMenu={showMenu} $minimalist={minimalist}/>
  );

  return (
    <StyledMainContainer>
      <LexicalComposer initialConfig={lexicalConfig}>
        <StyledEditorContainer $minimalist={minimalist}>
          <EditablePlugin editable={!!showMenu} />
          {showMenu && props.createPost && props.openPicker && props.handleChange && props.fileInputRef && (
            <LexicalCustomTextActions
              closeMenu={closeMenu}
              minimalist={minimalist}
              size={minimalist ? "small" : "large"}
              onSubmit={props.createPost}
              openPicker={props.openPicker}
              handleChange={props.handleChange}
              fileInputRef={props.fileInputRef}
              attachmentName={props.attachmentName}
            />
          )}
          <RichTextPlugin
              contentEditable={CustomContent}
              placeholder={showMenu ? <CustomPlaceholder/> : null}
              ErrorBoundary={LexicalErrorBoundary}
          />
          {showMenu && <HistoryPlugin/>}
        </StyledEditorContainer>
      </LexicalComposer>
    </StyledMainContainer>
  );
}

export default TextEditor