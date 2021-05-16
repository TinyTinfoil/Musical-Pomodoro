let e={normalMusic:-1,breakMusic:-2};browser.runtime.onMessage.addListener((r=>r.GetID?Promise.resolve(e[r.GetID]):r.SetID?Promise.resolve(e[r.SetID.name]=r.SetID.value):void 0));
