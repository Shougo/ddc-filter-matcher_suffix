import type { Context, Item, SourceOptions } from "@shougo/ddc-vim/types";
import { BaseFilter } from "@shougo/ddc-vim/filter";
import { convertKeywordPattern } from "@shougo/ddc-vim/utils";
import { assertEquals } from "@std/assert";

import type { Denops } from "@denops/std";

type Params = Record<string, never>;

export class Filter extends BaseFilter<Params> {
  override async filter(args: {
    denops: Denops;
    sourceOptions: SourceOptions;
    context: Context;
    completeStr: string;
    items: Item[];
  }): Promise<Item[]> {
    // Convert keywordPattern
    const keywordPattern = await convertKeywordPattern(
      args.denops,
      args.sourceOptions.keywordPattern,
    );

    return filterItemsBySuffix(
      args.context.nextInput,
      keywordPattern,
      args.items,
    );
  }

  override params(): Params {
    return {};
  }
}

function filterItemsBySuffix(
  nextInput: string,
  keywordPattern: string,
  items: Item[],
): Item[] {
  if (nextInput == "") {
    return items;
  }

  const match = nextInput.match(new RegExp(`^${keywordPattern}`));
  if (!match) {
    return items;
  }

  const suffix = match[0];
  return items.filter((item) => item.word.endsWith(suffix));
}

Deno.test("returns items as-is when nextInput is empty", () => {
  const items = [{ word: "foo" }, { word: "bar" }];
  const result = filterItemsBySuffix("", "[a-z]+", items as never);
  assertEquals(result, items);
});

Deno.test("filters items by suffix", () => {
  const items = [{ word: "foobar" }, { word: "bar" }, { word: "baz" }];
  const result = filterItemsBySuffix("bar", "[a-z]+", items as never);

  assertEquals(result, [{ word: "foobar" }, { word: "bar" }]);
});

Deno.test("returns items as-is when keywordPattern does not match input", () => {
  const items = [{ word: "foobar" }, { word: "bar" }];
  const result = filterItemsBySuffix("bar", "[0-9]+", items as never);
  assertEquals(result, items);
});

Deno.test("uses only the prefix matched by keywordPattern", () => {
  const items = [
    { word: "foobar" },
    { word: "bar" },
    { word: "baz" },
    { word: "foo" },
  ];

  const result = filterItemsBySuffix("bar!", "[a-z]+", items as never);

  assertEquals(result, [
    { word: "foobar" },
    { word: "bar" },
  ]);
});
