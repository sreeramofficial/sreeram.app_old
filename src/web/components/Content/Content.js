import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Markdown from './Markdown';
import Hidden from '@material-ui/core/Hidden';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';
const variables = require('../../../../config/variables');

import topics from '../../../../config/topics';

/**
 *
 * @param {string} name
 * @param {string} url
 * @return {String}
 */
const getParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[[\]]/g, '\\$&');
  let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

/**
 *
 *
 * @param {*} props
 * @return {Component}
 */
class PaperSheet extends React.Component {
  state = {
    activeStep: 0,
  };

  /**
   *
   * @param {object} prevProps
   * @memberof PaperSheet
   */
  componentDidUpdate(prevProps) {
    const { topic, post } = this.props;
    if (this.props.post !== prevProps.post) {
      let activeStep = 0;
      topics.forEach(t => {
        t.links.forEach((tl, i) => {
          if (tl.route === `/post/${topic}/${post}`) activeStep = i;
        });
      });
      this.setState({
        activeStep,
      });
      document.title = post.charAt(0).toUpperCase() + (post.slice(1, post.length)).replace(/_/g, ' ') + ' - ' + variables.navbar.title;
    }
  }

  /**
   *
   *
   * @return {array} array
   * @memberof PaperSheet
   */
  getSteps() {
    const { topic } = this.props;
    let ret = [];
    topics.forEach(t => {
      t.links.forEach(tl => {
        if (tl.route.split('/')[2] === topic) ret.push(tl.name);
      });
    });
    return ret;
  }

  /**
   *
   *
   * @return {Component}
   * @memberof PaperSheet
   */
  render() {
    const { classes, topic, post } = this.props;
    const steps = this.getSteps();
    const queryParam = getParameterByName('q');
    const { activeStep } = this.state;

    return (
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Paper className={classes.root} elevation={1}>
          <Grid container spacing={0}>
            <Grid item lg={9}>
              {queryParam && <div dangerouslySetInnerHTML={{ __html: '<gcse:searchresults-only></gcse:searchresults-only>' }} />}
              {!queryParam && <Markdown className={classes.markdown} key={post.substring(0, 40)}>
              {require(`../../posts/${topic}/${post}.md`)}
            </Markdown>}
            </Grid>
            <Grid item md={3}>
              <Hidden mdDown>
                <Stepper activeStep={activeStep} orientation="vertical">
                  {steps.map((label, index) => {
                    return (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
              </Hidden>
            </Grid>
          </Grid>
        </Paper>
      </main>
    );
  }
}

export default withStyles(styles)(PaperSheet);
