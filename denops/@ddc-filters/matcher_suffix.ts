import {
  BaseFilter,
  Context,
  Item,
  SourceOptions,
} from "https://deno.land/x/ddc_vim@v5.0.1/types.ts";
import {
  Denops,
} from "https://deno.land/x/ddc_vim@v5.0.1/deps.ts";
import { convertKeywordPattern } from "https://deno.land/x/ddc_vim@v5.0.1/utils.ts";

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
    const match = args.context.nextInput.match(new RegExp(`^${keywordPattern}`));
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
