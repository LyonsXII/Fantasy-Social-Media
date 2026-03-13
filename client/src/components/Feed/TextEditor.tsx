import styled from 'styled-components';

import {LexicalComposer} from '@lexical/react/LexicalComposer';
import type {InitialConfigType} from '@lexical/react/LexicalComposer';
import {RichTextPlugin} from "@lexical/react/LexicalRichTextPlugin";
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {LexicalCustomTextActions} from './TextEditorCustomTextActions.tsx'

import './Lexical.css';

const StyledMainContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100% - 1rem);
  width: 100%;
`;

const StyledEditableContent = styled(ContentEditable)<{ $showMenu: boolean }>`
  position: relative;
  height: 100%;
  width: 100%;
  padding: 0.6rem;
  font-size: 1rem;
  border: ${({ $showMenu }) => ($showMenu ? "1px solid black" : "none")};
  border-radius: ${({ $showMenu }) => ($showMenu ? "0 0 1.2rem 1.2rem" : "none")};
  overflow-y: auto;
`;

const StyledPlaceholder = styled.div`
  position: absolute;
  left: 0.6rem;
  top: 60px;
  color: rgba(0,0,0,0.8);
`;

const CustomPlaceholder = () => {
    return (
        <StyledPlaceholder>
            Enter some text...
        </StyledPlaceholder>
    )
};

type TextEditorProps = {
  createPost?: (postData: any, lenRawText: number) => Promise<void>;
  showMenu: boolean;
  content?: string;
  openPicker: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
};

const TextEditor = ({createPost, showMenu, content, openPicker, handleChange, fileInputRef} : TextEditorProps) => {
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
    <StyledEditableContent $showMenu={showMenu}/>
  );

  return (
    <StyledMainContainer>
      <LexicalComposer initialConfig={lexicalConfig}>
        {showMenu && 
          <LexicalCustomTextActions 
            onSubmit={createPost}
            openPicker={openPicker}
            handleChange={handleChange}
            fileInputRef={fileInputRef} 
          />}
        <RichTextPlugin
            contentEditable={CustomContent}
            placeholder={showMenu ? CustomPlaceholder : null}
            ErrorBoundary={LexicalErrorBoundary}
        />
        {showMenu && <HistoryPlugin/>}
      </LexicalComposer>
    </StyledMainContainer>
  );
}

export default TextEditor
