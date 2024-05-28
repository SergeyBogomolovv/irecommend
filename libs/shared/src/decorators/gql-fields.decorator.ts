import {
  FieldNode,
  FragmentDefinitionNode,
  GraphQLResolveInfo,
  SelectionNode,
} from 'graphql';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GqlFields = (
  deep: boolean = true,
  parent: string | string[] = [],
) => {
  return createParamDecorator<
    {
      deep: boolean;
      parent: string | string[];
    },
    ExecutionContext,
    string[]
  >(({ deep, parent }, context) => {
    const ctx = GqlExecutionContext.create(context);
    const info = ctx.getInfo();
    return resolveFields(info, deep, parent);
  })({ deep, parent });
};

const resolveFields = (
  info: Pick<GraphQLResolveInfo, 'fieldNodes' | 'fragments'>,
  deep: boolean = true,
  parent: string | string[] = [],
) => {
  const fieldMap = resolveFieldMap(info, deep, parent);
  return fieldMapToDot(fieldMap);
};

const resolveFieldMap = (
  info: Pick<GraphQLResolveInfo, 'fieldNodes' | 'fragments'>,
  deep: boolean = true,
  parent: string | string[] = [],
) => {
  const { fieldNodes, fragments } = info;
  const parents = Array.isArray(parent) ? [...parent] : parent.split('.');

  if (parents.length) {
    const fieldNode = getFieldNode(info, parents);
    return resolveFieldMapRecursively(
      fieldNode?.selectionSet ? [...fieldNode.selectionSet.selections] : [],
      deep,
      fragments,
    );
  }

  return resolveFieldMapRecursively([...fieldNodes], deep, fragments);
};

const resolveFieldMapRecursively = (
  selectionNodes: SelectionNode[],
  deep: boolean,
  fragments: FragmentDict,
  fieldMap: FieldMap = {},
) => {
  for (const selectionNode of selectionNodes) {
    if (selectionNode.kind === 'Field') {
      if (deep && selectionNode.selectionSet) {
        fieldMap[selectionNode.name.value] = resolveFieldMapRecursively(
          [...selectionNode.selectionSet.selections],
          deep,
          fragments,
        );
      } else {
        fieldMap[selectionNode.name.value] = {};
      }
    } else if (selectionNode.kind === 'FragmentSpread') {
      const fragment = fragments[selectionNode.name.value];
      fieldMap = resolveFieldMapRecursively(
        [...fragment.selectionSet.selections],
        deep,
        fragments,
        fieldMap,
      );
    } else {
      fieldMap = resolveFieldMapRecursively(
        [...selectionNode.selectionSet.selections],
        deep,
        fragments,
        fieldMap,
      );
    }
  }

  return fieldMap;
};

interface FragmentDict {
  [key: string]: FragmentDefinitionNode;
}

interface FieldMap {
  [key: string]: FieldMap;
}

function fieldMapToDot(
  fieldMap: FieldMap,
  dots: string[] = [],
  parent: string[] = [],
) {
  for (const key of Object.keys(fieldMap)) {
    dots = [...dots, [...parent, key].join('.')];
    if (fieldMap[key]) {
      dots = fieldMapToDot(fieldMap[key], dots, [...parent, key]);
    }
  }
  return dots;
}

const getFieldNode = (
  info: Pick<GraphQLResolveInfo, 'fieldNodes' | 'fragments'>,
  path: string | string[] = [],
): FieldNode | undefined => {
  const { fieldNodes, fragments } = info;
  const fields = Array.isArray(path) ? [...path] : path.split('.');

  let selectionNodes: SelectionNode[] = [...fieldNodes];
  while (selectionNodes.length) {
    const currentNodes = [...selectionNodes];
    selectionNodes = [];

    const field = fields[0];

    let found = false;
    let fragmentFound = false;
    for (const selectionNode of currentNodes) {
      if (selectionNode.kind === 'Field') {
        if (selectionNode.name.value === field) {
          if (!found) {
            found = true;
            fields.shift();
          }
          if (!fields.length) {
            return selectionNode;
          }
          if (selectionNode.selectionSet) {
            selectionNodes = [
              ...selectionNodes,
              ...selectionNode.selectionSet.selections,
            ];
          }
        }
      } else if (selectionNode.kind === 'FragmentSpread') {
        fragmentFound = true;
        const fragment = fragments[selectionNode.name.value];
        selectionNodes = [
          ...selectionNodes,
          ...fragment.selectionSet.selections,
        ];
      } else {
        fragmentFound = true;
        selectionNodes = [
          ...selectionNodes,
          ...selectionNode.selectionSet.selections,
        ];
      }
    }

    if (!found && !fragmentFound) {
      return;
    }
  }
};
