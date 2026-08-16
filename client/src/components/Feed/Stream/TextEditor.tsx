import styled, { css } from 'styled-components';
import { useState, useEffect } from 'react';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import type { InitialConfigType } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { TextEditorCustomTextActions } from './TextEditorCustomTextActions.tsx'

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
  padding-bottom: 3rem;
  font-size: 1rem;
  border: ${({ $showMenu, $minimalist }) => {
    if ($showMenu) return "1px solid black";
    else if ($minimalist && $showMenu) return "1px solid grey";
    else return "none";
  }};
  border-radius: ${({ $minimalist }) => ($minimalist ? "0" : "0 0 1.2rem 1.2rem")};
  overflow-y: auto;
    padding-bottom: 3rem;

  &:focus {
    outline: none;
    background-color: rgba(0, 0, 0, 0.01);
  }

  -webkit-tap-highlight-color: transparent;
`;

const StyledPlaceholder = styled.div<{ $minimalist?: boolean }>`
  position: absolute;
  left: 0.6rem;
  top: ${({ $minimalist }) => $minimalist ? "10px" : "60px"};
  color: rgba(0,0,0,0.8);
`;

const StyledEditorContainer = styled.div<{ $minimalist?: boolean }>`
  display: flex;
  flex-direction: ${({ $minimalist }) =>
    $minimalist ? "column-reverse" : "column"};
  height: 100%;
  width: 100%;
`;

const StyledMessageText = styled.div<{ $showMessageText : boolean, $minimalist?: boolean }>`
  position: absolute;
  bottom: ${({ $minimalist }) => $minimalist ? "2.8rem" : "0.6rem"};
  ${({ $minimalist }) =>
    $minimalist
      ? css`
          left: 0.6rem;
        `
      : css`
          right: 2rem;
          text-align: right;
        `};
  height: 1rem;
  width: calc(100% - 6rem);
  font-size: 1rem;
  opacity: 0.8;
`;

const EditablePlugin = ({ editable }: { editable: boolean }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.setEditable(editable);
  }, [editor, editable]);

  return null;
};

const AutoFocusPlugin = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.focus();
  }, [editor]);

  return null;
};

type TextEditorProps = {
  showMenu?: boolean;
  closeMenu: (value: boolean) => void;  
  minimalist?: boolean;
  content?: string;
  createPost?: (postData: any) => Promise<void>;
  openPicker?: () => void;
  handleAttachment?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeAttachment?: () => void;
  fileInputRef?: React.RefObject<HTMLInputElement | null>;
  attachmentName?: string;
};

const TextEditor = (props : TextEditorProps) => {
  const { showMenu, content, minimalist, closeMenu } = props;
  const [messageText, setMessageText] = useState<string>("");
  const [showMessageText, setShowMessageText] = useState<boolean>(false);

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

  const CustomPlaceholder = () => {
      return (
        <StyledPlaceholder $minimalist={minimalist}>
            Enter some text...
        </StyledPlaceholder>
      )
  };

  const CustomContent = (
    <StyledEditableContent $showMenu={showMenu} $minimalist={minimalist}/>
  );

  // Show message text popup temporarily
  useEffect(() => {
    if (messageText != "") {
      setShowMessageText(true)
      const timer = setTimeout(() => {
        setMessageText("");
        setShowMessageText(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [messageText]);

  useEffect(() => {
    console.log(content);
  }, [content])

  return (
    <StyledMainContainer>
      <LexicalComposer initialConfig={lexicalConfig}>
        <StyledEditorContainer $minimalist={minimalist}>
          <EditablePlugin editable={!!showMenu} />
          {showMenu && props.createPost && props.openPicker && props.handleAttachment && props.fileInputRef && (
            <TextEditorCustomTextActions
              closeMenu={closeMenu}
              minimalist={minimalist}
              size={minimalist ? "small" : "large"}
              onSubmit={props.createPost}
              setMessageText={setMessageText}
              openPicker={props.openPicker}
              handleAttachment={props.handleAttachment}
              removeAttachment={props.removeAttachment}
              fileInputRef={props.fileInputRef}
              attachmentName={props.attachmentName}
            />
          )}
          
          {showMenu && <AutoFocusPlugin />}

          <RichTextPlugin
              contentEditable={CustomContent}
              placeholder={showMenu ? <CustomPlaceholder/> : null}
              ErrorBoundary={LexicalErrorBoundary}
          />
          {showMenu && <HistoryPlugin/>}
        </StyledEditorContainer>
      </LexicalComposer>

      <StyledMessageText $showMessageText={showMessageText} $minimalist={minimalist}>
        {messageText}
      </StyledMessageText>
    </StyledMainContainer>
  );
}

export default TextEditor