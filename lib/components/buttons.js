import React, {PropTypes, PureComponent} from 'react'

export class Group extends PureComponent {
  static propTypes = {
    justified: PropTypes.bool,
    vertical: PropTypes.bool
  }

  render () {
    const {children, justified, vertical, ...props} = this.props
    const classNames = ['btn-group']
    if (justified) classNames.push('btn-group-justified')
    if (vertical) classNames.push('btn-group-vertical')

    return (
      <div className={classNames.join(' ')} {...props}>{children}</div>
    )
  }
}

export class Button extends PureComponent {
  static propTypes = {
    block: PropTypes.bool,
    className: PropTypes.string,
    size: PropTypes.string,
    style: PropTypes.string
  }

  _onClick = (e) => {
    const {disabled, onClick} = this.props
    if (onClick) {
      e.preventDefault()
      if (!disabled) {
        onClick(e)
      }
    }
  }

  render () {
    const {children, href = '#', ...props} = this.props
    const {classNames, restProps} = getClassNamesFromProps(props)
    return <a
      {...restProps}
      className={classNames}
      href={href}
      tabIndex={0}
      onClick={this._onClick}
      >{children}</a>
  }
}

let idCounter = 0
export class RadioButton extends PureComponent {
  static propTypes = {
    block: PropTypes.bool,
    checked: PropTypes.bool,
    className: PropTypes.string,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    size: PropTypes.string,
    style: PropTypes.string
  }

  render () {
    const {children, id, onChange, ...props} = this.props
    const {classNames, restProps} = getClassNamesFromProps(props)
    const _id = id || `radio-button-${idCounter++}`
    return <label
      className={classNames}
      htmlFor={_id}
      >
      <input
        {...restProps}
        className='sr-only'
        id={_id}
        onChange={onChange}
        type='radio'
        />
      {children}
    </label>
  }
}

function getClassNamesFromProps ({
  block,
  checked,
  className,
  size,
  style,
  ...restProps
}) {
  const classNames = ['btn']
  if (style) classNames.push(`btn-${style}`)
  else classNames.push('btn-default')
  if (block) classNames.push('btn-block')
  if (size) classNames.push(`btn-${size}`)
  if (className) classNames.push(className)
  if (checked) classNames.push('active')
  return {
    classNames: classNames.join(' '),
    restProps
  }
}
