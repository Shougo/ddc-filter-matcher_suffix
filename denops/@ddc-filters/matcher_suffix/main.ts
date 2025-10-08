import type { Context, Item, SourceOptions } from "@shougo/ddc-vim/types";
import { BaseFilter } from "@shougo/ddc-vim/filter";
import { convertKeywordPattern } from "@shougo/ddc-vim/utils";

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
    if (args.context.nextInput == "") {
      return args.items;
    }

    // Convert keywordPattern
    const keywordPattern = await convertKeywordPattern(
      args.denops,
      args.sourceOptions.keywordPattern,
    );

    // Use keywordPattern as suffix
    const match = args.context.nextInput.match(
      new RegExp(`^${keywordPattern}`),
    );
    if (!match) {
      return args.items;
    }

    const suffix = match[0];
    return Promise.resolve(args.items.filter(
      (item) => item.word.endsWith(suffix),
    ));
  }

  override params(): Params {
    return {};
  }
}
