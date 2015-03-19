<?php

/**
 * Project:     Bright framework
 * Author:      Jager Mesh (jagermesh@gmail.com)
 *
 * @version 1.1.0.0
 * @package Bright Core
 */

require_once(__DIR__.'/BrGenericLogAdapter.php');

class BrErrorMailLogAdapter extends BrGenericLogAdapter {

  function writeError($message, $tagline = '') {

    if (br()->request()->isLocalHost() && !br()->isConsoleMode()) {

    } else {
      $email = br()->config()->get('br/mail/support', br()->config()->get('br/BrErrorHandler/exceptionHandler/sendErrorsTo', br()->config()->get('br/report-errors-email')));
      if ($email) {
        try {
          $requestData = '';
          if (br()->request()->isGET()) {
            $requestData = @json_encode(br()->request()->get());
          }
          if (br()->request()->isPOST()) {
            $requestData = @json_encode(br()->request()->post());
          }
          if (br()->request()->isPUT()) {
            $requestData = @json_encode(br()->request()->put());
          }
          $subject = 'Error report';
          if ($tagline) {
            $subject .= ': ' . $tagline;
          }

          $userInfo = '';
          $login = br()->auth()->getLogin();
          if ($login) {
            $userInfo = '<strong>User ID:</strong> ' . br($login, 'id') . '<br />';
            if (br($login, 'name')) {
              $userInfo .= '<strong>User name:</strong> ' . br($login, 'name') . '<br />';
            }
            if ($loginField = br()->auth()->getAttr('usersTable.loginField')) {
              if (br($login, $loginField)) {
                $userInfo .= '<strong>User login:</strong> ' . br($login, $loginField) . '<br />';
              }
            }
            if ($emailField = br()->auth()->getAttr('usersTable.emailField')) {
              if (br($login, $loginField)) {
                $userInfo .= '<strong>User e-mail:</strong> ' . br($login, $emailField) . '<br />';
              }
            }
          }

          $body = '<html>'
                . '<body>'
                . '<strong>Timestamp:</strong> ' . date('r') . '<br />'
                . '<strong>Script name:</strong> ' . br()->scriptName() . '<br />'
                . '<strong>Request URL:</strong> <a href="' . br()->request()->url() . '">' . br()->request()->url(). '</a><br />'
                . '<strong>Referer URL:</strong> <a href="' . br()->request()->referer() . '">' . br()->request()->referer() . '</a><br />'
                . '<strong>Client IP:</strong> ' . br()->request()->clientIP() . '<br />'
                . $userInfo
                . '<strong>Request type:</strong> ' . br()->request()->method() . '<br />'
                . '<strong>Request data:</strong> ' . $requestData . '<br />'
                . '<strong>Command line:</strong> ' . @json_encode($argv) . '<br />'
                . '<hr size="1" />'
                . '<pre>'
                . $message
                . '</pre>'
                . '</body>'
                . '</html>';
          br()->sendMail($email, $subject, $body);
        } catch (Exception $e) {
        }
      }
    }

  }

  function writeDebug($message, $tagline = '') {

    if (br()->request()->isLocalHost() || br()->isConsoleMode()) {

    } else {
      $email = br()->config()->get('br/mail/support', br()->config()->get('br/BrErrorHandler/exceptionHandler/sendErrorsTo', br()->config()->get('br/report-errors-email')));
      if ($email) {
        try {
          $requestData = '';
          if (br()->request()->isGET()) {
            $requestData = json_encode(br()->request()->get());
          }
          if (br()->request()->isPOST()) {
            $requestData = json_encode(br()->request()->post());
          }
          if (br()->request()->isPUT()) {
            $requestData = json_encode(br()->request()->put());
          }
          $subject = 'Debug message';
          if ($tagline) {
            $subject .= ': ' . $tagline;
          }
          $body  = '<html>'
                   . '<body>'
                   . '<strong>Timestamp:</strong> ' . date('r') . '<br />'
                   . '<strong>Script name:</strong> ' . br()->scriptName() . '<br />'
                   . '<strong>Request URL:</strong> <a href="' . br()->request()->url() . '">' . br()->request()->url(). '</a><br />'
                   . '<strong>Referer URL:</strong> <a href="' . br()->request()->referer() . '">' . br()->request()->referer() . '</a><br />'
                   . '<strong>Client IP:</strong> ' . br()->request()->clientIP() . '<br />'
                   . '<strong>Request type:</strong> ' . br()->request()->method() . '<br />'
                   . '<strong>Request data:</strong> ' . $requestData . '<br />'
                   . '<strong>Command line:</strong> ' . @json_encode($argv) . '<br />'
                   . '<hr size="1" />'
                   . '<pre>'
                   . $message
                   . '</pre>'
                   . '</body>'.
                   ' </html>';
          br()->sendMail($email, $subject, $body);
        } catch (Exception $e) {
        }
      }
    }

  }

  function writeMessage($message, $group = 'MSG', $tagline = '') {

    switch($group) {
      case 'ERR':
        $this->writeError($message, $tagline);
        break;
      case 'DBG':
        $this->writeDebug($message, $tagline);
        break;
    }

  }


}
