import styled from 'styled-components';
import { useState, useEffect } from 'react';

import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {FORMAT_TEXT_COMMAND} from 'lexical';
import type {TextFormatType} from 'lexical';
import {$getSelection, $isRangeSelection, $getRoot} from "lexical";

import BoldIcon from "../../assets/icons/lexical/bold.svg?react";
import ItalicIcon from "../../assets/icons/lexical/italic.svg?react";
import UnderlineIcon from "../../assets/icons/lexical/underline.svg?react";
import CodeIcon from "../../assets/icons/lexical/code.svg?react";
import HighlightIcon from "../../assets/icons/lexical/highlight.svg?react";
import StrikethroughIcon from "../../assets/icons/lexical/strikethrough.svg?react";
import SubscriptIcon from "../../assets/icons/lexical/subscript.svg?react";
import SuperscriptIcon from "../../assets/icons/lexical/superscript.svg?react";
import AttachIcon from "../../assets/icons/lexical/attach.svg?react";
import ConfirmIcon from "../../assets/icons/lexical/confirm.svg?react";

const StyledButtonContainer = styled.div`
  display: flex;
  height: fit-content;
  width: 100%;
  border: 1px solid black;
  border-bottom: none;
  border-radius: 1.2rem 1.2rem 0 0;
`;

const StyledButton = styled.button<{$position?: string, $active?: boolean}>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 3rem;
  padding: 1rem;
  gap: 0.6rem;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;

  ${({ $active }) =>
    $active &&
    `
    `}

  &:hover {
  }
`;

const createStyledIcon = (IconComponent: React.ComponentType<any>) =>
  styled(IconComponent)`
    height: 20px;
    width: 20px;
    cursor: pointer;
    vertical-align: bottom;
    transition: transform 0.4s;
    color: white;
`;

const StyledBoldIcon = createStyledIcon(BoldIcon);
const StyledItalicIcon = createStyledIcon(ItalicIcon);
const StyledUnderlineIcon = createStyledIcon(UnderlineIcon);
const StyledCodeIcon = createStyledIcon(CodeIcon);
const StyledHighlightIcon = createStyledIcon(HighlightIcon);
const StyledStrikethroughIcon = createStyledIcon(StrikethroughIcon);
const StyledSubscriptIcon = createStyledIcon(SubscriptIcon);
const StyledSuperscriptIcon = createStyledIcon(SuperscriptIcon);
const StyledAttachIcon = createStyledIcon(AttachIcon);
const StyledConfirmIcon = createStyledIcon(ConfirmIcon);

type LexicalCustomTextActionsProps = {
  onSubmit?: (postData: any, lenRawText: number) => Promise<void>;
  openPicker: () => void | undefined;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void | undefined;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
};


export const LexicalCustomTextActions = ({onSubmit, openPicker, handleChange, fileInputRef} : LexicalCustomTextActionsProps) => {
  const [editor] = useLexicalComposerContext();
  const [active, setActive] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    code: false,
    subscript: false,
    superscript: false,
    highlight: false,
  });

  const handleOnClick = (formatType: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, formatType);
  }

  // Register text formatting effects
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          setActive({
            bold: selection.hasFormat("bold"),
            italic: selection.hasFormat("italic"),
            underline: selection.hasFormat("underline"),
            code: selection.hasFormat("code"),
            highlight: selection.hasFormat("highlight"),
            strikethrough: selection.hasFormat("strikethrough"),
            subscript: selection.hasFormat("subscript"),
            superscript: selection.hasFormat("superscript"),
          });
        } else {
          // Reset if no valid range selection
          setActive(prev =>
            Object.fromEntries(
              Object.keys(prev).map(key => [key, false])
            ) as typeof prev
          );
        }
      });
    });
  }, [editor]);

  return (
      <StyledButtonContainer>
        <StyledButton $position="first" $active={active.bold} onClick={() => handleOnClick("bold")}>
          <StyledBoldIcon/>
        </StyledButton>
        <StyledButton $active={active.italic} onClick={() => handleOnClick("italic")}>
          <StyledItalicIcon/>
        </StyledButton>
        <StyledButton $active={active.underline} onClick={() => handleOnClick("underline")}>
          <StyledUnderlineIcon/>
        </StyledButton>
        <StyledButton $active={active.code} onClick={() => handleOnClick("code")}>
          <StyledCodeIcon/>
        </StyledButton>
        <StyledButton $active={active.highlight} onClick={() => handleOnClick("highlight")}>
          <StyledHighlightIcon/>
        </StyledButton>
        <StyledButton $active={active.strikethrough} onClick={() => handleOnClick("strikethrough")}>
          <StyledStrikethroughIcon/>
        </StyledButton>
        <StyledButton $active={active.subscript} onClick={() => handleOnClick("subscript")}>
          <StyledSubscriptIcon/>
        </StyledButton>
        <StyledButton $active={active.superscript} onClick={() => handleOnClick("superscript")}>
          <StyledSuperscriptIcon/>
        </StyledButton>

        <div style={{"flexGrow":"1"}}/>

        <StyledButton onClick={openPicker}>
          <StyledAttachIcon/>
        </StyledButton>
        <StyledButton   
          onClick={async () => {
            const json = editor.getEditorState().toJSON();
            const lenRawText = editor.getEditorState().read(() => {
              const text = $getRoot().getTextContent();
              return text.length
            });
            await onSubmit?.(json, lenRawText);
        }}>
          Post
          <StyledConfirmIcon/>
        </StyledButton>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleChange}
          accept="image/png,image/jpeg,image/webp"
        />
      </StyledButtonContainer>
  );
}