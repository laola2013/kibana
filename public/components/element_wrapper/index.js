import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getEditing } from '../../state/selectors/app';
import { getResolvedArgs, getSelectedPage } from '../../state/selectors/workpad';
import { getState, getValue, getError } from '../../lib/resolved_arg';
import { ElementWrapper as Component } from './element_wrapper';
import { createHandlers as createHandlersWithDispatch } from './lib/handlers';

const mapStateToProps = (state, { element }) => ({
  isEditing: getEditing(state),
  resolvedArg: getResolvedArgs(state, element.id, 'expressionRenderable'),
  selectedPage: getSelectedPage(state),
});

const mapDispatchToProps = (dispatch, { element }) => ({
  createHandlers: pageId => () => createHandlersWithDispatch(element, pageId, dispatch),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { resolvedArg, selectedPage } = stateProps;
  const { element, restProps } = ownProps;
  const { id, transformMatrix, a, b } = element;

  return {
    ...restProps, // pass through unused props
    id, //pass through useful parts of the element object
    transformMatrix,
    a,
    b,
    state: getState(resolvedArg),
    error: getError(resolvedArg),
    renderable: getValue(resolvedArg),
    createHandlers: dispatchProps.createHandlers(selectedPage),
  };
};

export const ElementWrapper = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Component);

ElementWrapper.propTypes = {
  element: PropTypes.shape({
    id: PropTypes.string.isRequired,
    transformMatrix: PropTypes.arrayOf(PropTypes.number).isRequired,
    a: PropTypes.number.isRequired,
    b: PropTypes.number.isRequired,
  }).isRequired,
};
