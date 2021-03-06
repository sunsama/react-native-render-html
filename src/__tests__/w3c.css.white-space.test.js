import React from "react";
import HTML from "../index";
import renderer from "react-test-renderer";
import { extractTextFromInstance } from "./utils";

function testCollapseRuleForCharacter(character, name) {
  const action =
    character === " " ? "preserves a space" : `replaces ${name} with a space`;
  it(`collapses whitespaces when first text tag has a trailing ${name} and the second starts with a ${name}`, () => {
    const testRenderer = renderer.create(
      <HTML html={`<span>foo${character}</span><span>${character}bar</span>`} />
    );
    const renderedText = extractTextFromInstance(testRenderer.root);
    expect(renderedText).toEqual("foo bar");
  });
  it(`${action} when the first text tag has a trailing ${name} and the second doesn't contain any`, () => {
    const testRenderer = renderer.create(
      <HTML html={`<b>bold${character}</b><span>text</span>`} />
    );
    const renderedText = extractTextFromInstance(testRenderer.root);
    expect(renderedText).toEqual("bold text");
  });
  it(`${action} between two inline elements which don't contain ${name}s and are separated with a ${name}`, () => {
    const testRenderer = renderer.create(
      <HTML html={`<b>bold</b>${character}<span>text</span>`} />
    );
    const renderedText = extractTextFromInstance(testRenderer.root);
    expect(renderedText).toEqual("bold text");
  });
}

/**
 * This serie covers white-space CSS rule, normal behavior, i.e.
 *
 *     white-space: normal;
 *
 * as documented here: https://www.w3.org/TR/css-text-3 (sections 3 and 4)
 */
// Skip because a fix is not ready yet
// eslint-disable-next-line jest/no-disabled-tests
describe.skip("HTML component regarding CSS white-space: normal rule", () => {
  describe("involving spaces", () => {
    testCollapseRuleForCharacter(" ", "space");
  });
  describe("involving line feeds", () => {
    testCollapseRuleForCharacter("\n", "line feed");
  });
  describe("involving tabs", () => {
    testCollapseRuleForCharacter("\t", "tab");
  });
  describe("involving form feeds", () => {
    testCollapseRuleForCharacter("\f", "form feed");
  });
});
