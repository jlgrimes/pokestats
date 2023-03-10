export const parseDeckUrlParams = (params: string[]) => {
  const validCardParam = params.at(params.length - 1) === 'cards';
  const validFinishesParam = params.at(params.length - 1) === 'finishes';

  return {
    supertypeId: parseInt(params[0]),
    archetypeId:
      (params[1] && !['cards', 'finishes'].includes(params[1]))
        ? parseInt(params[1])
        : null,
    slug: validCardParam ? 'cards' : validFinishesParam ? 'finishes' : null,
  };
};
