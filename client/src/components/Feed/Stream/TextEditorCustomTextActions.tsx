import styled from 'styled-components';
import { useState, useEffect } from 'react';

import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {FORMAT_TEXT_COMMAND} from 'lexical';
import type {TextFormatType} from 'lexical';
import {$getSelection, $isRangeSelection, $getRoot} from "lexical";

import BoldIcon from "../../../assets/icons/lexical/bold.svg?react";
import ItalicIcon from "../../../assets/icons/lexical/italic.svg?react";
import UnderlineIcon from "../../../assets/icons/lexical/underline.svg?react";
import CodeIcon from "../../../assets/icons/lexical/code.svg?react";
import HighlightIcon from "../../../assets/icons/lexical/highlight.svg?react";
import StrikethroughIcon from "../../../assets/icons/lexical/strikethrough.svg?react";
import SubscriptIcon from "../../../assets/icons/lexical/subscript.svg?react";
import SuperscriptIcon from "../../../assets/icons/lexical/superscript.svg?react";
import AttachIcon from "../../../assets/icons/lexical/attach.svg?react";
import ConfirmIcon from "../../../assets/icons/lexical/confirm.svg?react";

const StyledButtonContainer = styled.div<{$minimalist?: boolean}>`
  display: flex;
  height: fit-content;
  width: 100%;
  border: 1px solid black;
  border-bottom: ${({$minimalist }) => {
    if (!$minimalist) return "none";
  }};
  border-top: ${({$minimalist }) => {
    if ($minimalist) return "none";
  }};
  border-radius: ${({ $minimalist }) => $minimalist ? "0" : "1.2rem 1.2rem 0 0"};
`;

const StyledButton = styled.button<{$size?: string, $position?: string, $active?: boolean}>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${({ $size }) => $size == "large" ? "3rem" : "18px"};
  padding: 1rem;
  gap: 0.6rem;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1;
  font-family: inherit;
  opacity: 0.8;
  cursor: pointer;

  ${({ $active }) =>
    $active &&
    `
    `}

  &:hover {
  }
`;

const createStyledIcon = (IconComponent: React.ComponentType<any>) =>
  styled(IconComponent)<{ $size?: string }>`
    height: ${({ $size }) => $size == "large" ? "20px" : "14px"};
    width: ${({ $size }) => $size == "large" ? "20px" : "14px"};
    cursor: pointer;
    vertical-align: bottom;
    transition: transform 0.4s;
    color: white;
  `;

const StyledTextContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 1rem;
  font-weight: 600;
  opacity: 0.8;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

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
  closeMenu: (value: boolean) => void;
  minimalist?: boolean;
  size?: string;
  onSubmit?: (postData: any) => Promise<void>;
  openPicker: () => void | undefined;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void | undefined;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  attachmentName?: string;
};

export const LexicalCustomTextActions = ({closeMenu, minimalist, size, onSubmit, openPicker, handleChange, fileInputRef, attachmentName} : LexicalCustomTextActionsProps) => {
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
      <StyledButtonContainer $minimalist={minimalist}>
        <StyledButton $size={size} $position="first" $active={active.bold} onClick={() => handleOnClick("bold")}>
          <StyledBoldIcon $size={size}/>
        </StyledButton>
        <StyledButton $size={size} $active={active.italic} onClick={() => handleOnClick("italic")}>
          <StyledItalicIcon $size={size}/>
        </StyledButton>
        <StyledButton $size={size} $active={active.underline} onClick={() => handleOnClick("underline")}>
          <StyledUnderlineIcon $size={size}/>
        </StyledButton>
        <StyledButton $size={size} $active={active.code} onClick={() => handleOnClick("code")}>
          <StyledCodeIcon $size={size}/>
        </StyledButton>
        <StyledButton $size={size} $active={active.highlight} onClick={() => handleOnClick("highlight")}>
          <StyledHighlightIcon $size={size}/>
        </StyledButton>
        <StyledButton $size={size} $active={active.strikethrough} onClick={() => handleOnClick("strikethrough")}>
          <StyledStrikethroughIcon $size={size}/>
        </StyledButton>
        <StyledButton $size={size} $active={active.subscript} onClick={() => handleOnClick("subscript")}>
          <StyledSubscriptIcon $size={size}/>
        </StyledButton>
        <StyledButton $size={size} $active={active.superscript} onClick={() => handleOnClick("superscript")}>
          <StyledSuperscriptIcon $size={size}/>
        </StyledButton>

        <div style={{"flexGrow":"1"}}/>

        <StyledButton $size={size} onClick={openPicker}>
          {attachmentName || "Attach Image"}
          <StyledAttachIcon $size={size}/>
        </StyledButton>
        
        <StyledButton
          $size={size}
          onClick={async () => {
            const json = editor.getEditorState().toJSON();
            await onSubmit?.(json);
            closeMenu(false);
        }}>
          {minimalist ? "Update Post" : "Post"}
          <StyledConfirmIcon $size={size}/>
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