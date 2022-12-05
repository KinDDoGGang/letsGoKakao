const express = require('express');
const router = express.Router();
const { get, set, add, del, getPage, getAll } = require('./db/simple-db');
const { NotFound, Forbidden, BadRequest } = require('./exception');
const { produce } = require('immer');

const responseOneOrNotfound = (dbName, id, res) => {
  getOneOrNotfound(dbName, id, (item) => {
    res.json(item);
  })
};

const getOneOrNotfound = (dbName, id, handler) => {
  const item = get(dbName, id);
  if(item) {
    return handler(item);
  } else {
    throw new NotFound(id);
  }
}

router.get('/usernames', (req, res, next) => {
  const usernames = getAll('users').map(user => user.id).sort((a, b) => a.localeCompare(b));
  res.json(usernames);
})

router.get('/templates', (req, res, next) => {
  res.json(getAll('templates').map(template => ({
    id: template.id,
    label: template.label
  })));
});

router.get('/templates/:id', function(req, res, next) {
  responseOneOrNotfound('templates', req.params.id, res);
});

router.get('/requests', (req, res, next) => {
  const { pageNumber, pageSize } = req.query;
  res.json(getPage('requests', pageNumber, pageSize));
});

router.get('/requests/:id', (req, res, next) => {
  responseOneOrNotfound('requests', req.params.id, res);
});

router.post('/requests', (req, res, next) => {
  const { templateId, title, assignees, data } = req.body;
  if(!templateId) {
    throw new BadRequest('템플릿 아이디(templateId)가 필요합니다.');
  }

  if(!title) {
    throw new BadRequest('요청 제목이 필요합니다.');
  }

  if(!(assignees && Array.isArray(assignees))) {
    throw new BadRequest('담당자가 설정되지 않았거나 올바르지 않은 타입입니다.');
  }

  const template = getOneOrNotfound('templates', templateId, template => template);

  if(assignees.length < template.steps.length - 1) {
    throw new BadRequest('담당자 정보가 부족합니다. 마지막 단계를 제외한 모든 단계에 담당자가 설정되어야 합니다.');
  }

  const steps = produce(template.steps, draft => {
    for(let i = 0; i < draft.length - 1; i++) {
      draft[i].assignee = assignees[i];
    }
  });

  res.json(add('requests', {
    templateId,
    currentStepKey: steps[0].key,
    requestedBy: req.username,
    steps,
    title,
    data
  }));
});

router.patch('/requests/:id/next', (req, res, next) => {
  const { username } = req;
  getOneOrNotfound('requests', req.params.id, request => {
    const { steps } = request;
    const currentStepIndex = steps.findIndex(step => step.key === request.currentStepKey);
    const currentStep = steps[currentStepIndex];

    if(currentStep.assignee !== username) {
      throw new Forbidden(`${currentStep.actionLabel} 작업을 수행할 권한이 없습니다.`);
    }

    if(currentStepIndex >= request.steps.length) {
      throw new BadRequest('다음 단계가 없습니다.');
    }

    request.currentStepKey = request.steps[currentStepIndex + 1].key;
    const updated = set('requests', request.id, request);

    res.json(updated);
  });
});

router.get('/requests/:id/comment', (req, res, next) => {
  const { pageNumber, pageSize } = req.query;
  const page = getPage('comments', pageNumber, pageSize);
  res.json(page || []);
});

router.post('/requets/:id/comment', (req, res, next) => {
  const comments = get(req.params.id);
  const { contents } = req.body;

  set('comments', req.params.id, [...comments, {
    writtenBy: req.username, 
    contents,
    createdAt: Date.now()
  }]);
});

module.exports = router;
