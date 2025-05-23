/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { usePrefix } from '../../internal/usePrefix';
import { GridSettings, useGridSettings } from './GridContext';
import { GridComponent, GridBaseProps } from './GridTypes';
import {
  PolymorphicComponentPropWithRef,
  PolymorphicRef,
} from '../../internal/PolymorphicProps';

const CSSGrid = React.forwardRef<
  any,
  GridBaseProps & {
    as?: React.ElementType;
  } & React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      align,
      as,
      children,
      className: customClassName,
      condensed = false,
      fullWidth = false,
      narrow = false,
      ...rest
    },
    ref?
  ) => {
    const prefix = usePrefix();
    const { subgrid } = useGridSettings();
    let mode: SubgridMode = 'wide';
    if (narrow) {
      mode = 'narrow';
    } else if (condensed) {
      mode = 'condensed';
    }

    if (subgrid) {
      return (
        <GridSettings mode="css-grid" subgrid>
          <Subgrid
            ref={ref}
            as={as}
            className={customClassName}
            mode={mode}
            {...rest}>
            {children}
          </Subgrid>
        </GridSettings>
      );
    }

    const className = cx(customClassName, {
      [`${prefix}--css-grid`]: true,
      [`${prefix}--css-grid--condensed`]: mode === 'condensed',
      [`${prefix}--css-grid--narrow`]: mode === 'narrow',
      [`${prefix}--css-grid--full-width`]: fullWidth,
      [`${prefix}--css-grid--start`]: align === 'start',
      [`${prefix}--css-grid--end`]: align === 'end',
    });

    // cast as any to let TypeScript allow passing in attributes to base component
    const BaseComponent = as || 'div';
    return (
      <GridSettings mode="css-grid" subgrid>
        <BaseComponent className={className} ref={ref} {...rest}>
          {children}
        </BaseComponent>
      </GridSettings>
    );
  }
) as GridComponent;

CSSGrid.propTypes = {
  /**
   * Provide a custom element to render instead of the default <div>
   */
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),

  /**
   * Specify grid alignment. Default is center
   */
  align: PropTypes.oneOf(['start', 'center', 'end']),

  /**
   * Pass in content that will be rendered within the `Grid`
   */
  children: PropTypes.node,

  /**
   * Specify a custom className to be applied to the `Grid`
   */
  className: PropTypes.string,

  /**
   * Collapse the gutter to 1px. Useful for fluid layouts.
   * Rows have 1px of margin between them to match gutter.
   */
  condensed: PropTypes.bool,

  /**
   * Remove the default max width that the grid has set
   */
  fullWidth: PropTypes.bool,

  /**
   * Container hangs 16px into the gutter. Useful for
   * typographic alignment with and without containers.
   */
  narrow: PropTypes.bool,
};

type SubgridMode = 'wide' | 'narrow' | 'condensed';

interface SubgridBaseProps {
  /**
   * Pass in content that will be rendered within the `Subgrid`
   */
  children?: React.ReactNode;

  /**
   * Specify a custom className to be applied to the `Subgrid`
   */
  className?: string;

  /**
   * Specify the gutter mode for the subgrid
   */
  mode?: SubgridMode;
}

type SubgridProps<T extends React.ElementType = 'div'> =
  PolymorphicComponentPropWithRef<T, SubgridBaseProps>;

const Subgrid = React.forwardRef<
  any,
  SubgridBaseProps & {
    as?: React.ElementType;
  } & React.HTMLAttributes<HTMLDivElement>
>(({ as, className: customClassName, children, mode, ...rest }, ref) => {
  const prefix = usePrefix();
  const className = cx(customClassName, {
    [`${prefix}--subgrid`]: true,
    [`${prefix}--subgrid--condensed`]: mode === 'condensed',
    [`${prefix}--subgrid--narrow`]: mode === 'narrow',
    [`${prefix}--subgrid--wide`]: mode === 'wide',
  });
  const BaseComponent = as || 'div';
  return (
    <BaseComponent {...rest} ref={ref} className={className}>
      {children}
    </BaseComponent>
  );
});

Subgrid.propTypes = {
  /**
   * Provide a custom element to render instead of the default <div>
   */
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),

  /**
   * Pass in content that will be rendered within the `Subgrid`
   */
  children: PropTypes.node,

  /**
   * Specify a custom className to be applied to the `Subgrid`
   */
  className: PropTypes.string,

  /**
   * Specify the gutter mode for the subgrid
   */
  mode: PropTypes.oneOf(['wide', 'narrow', 'condensed'] as SubgridMode[]),
};

const CSSGridComponent: GridComponent = CSSGrid;

export { CSSGridComponent as CSSGrid };
