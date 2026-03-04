import styled from 'styled-components';

import {$getRoot, $getSelection} from 'lexical';
import {useEffect, useMemo } from 'react';

import {LexicalComposer} from '@lexical/react/LexicalComposer';
import type {InitialConfigType} from '@lexical/react/LexicalComposer';
import {RichTextPlugin} from "@lexical/react/LexicalRichTextPlugin";
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {LexicalCustomTextActions} from './LexicalCustomTextActions.tsx'

import './Lexical.css';

const StyledMainContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100% - 1rem);
  width: 100%;
`;

const StyledEditableContent = styled(ContentEditable)`
  position: relative;
  height: 100%;
  width: 100%;
  padding: 0.6rem;
  font-size: 1rem;
  border: 1px solid black;
  border-radius: 0 0 1.2rem 1.2rem;
  overflow-y: auto;
`;

const CustomContent = (
  <StyledEditableContent/>
);

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
  createPost: (postData: any, lenRawText: number) => Promise<void>;
};

const TextEditor = ({createPost} : TextEditorProps) => {
  const lexicalConfig: InitialConfigType = {
      namespace: 'Create Post Text Editor',
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
      onError: (e) => {
          console.log('ERROR:', e)
      }
  }

  return (
    <StyledMainContainer>
      <LexicalComposer initialConfig={lexicalConfig}>
        <LexicalCustomTextActions createPost={createPost}/>
        <RichTextPlugin
            contentEditable={CustomContent}
            placeholder={CustomPlaceholder}
            ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin/>
      </LexicalComposer>
    </StyledMainContainer>
  );
}

export default TextEditor
