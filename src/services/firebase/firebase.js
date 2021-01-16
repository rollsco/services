import app from "firebase/app";
import "firebase/firestore";
import "firebase/analytics";
import { firebaseConfig } from "./config";
import { logError, getDocWithId, getDocsWithId } from "./utils";

const environment = process.env.REACT_APP_ENV;

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);
    this.db = app.firestore();
    if (process.env.REACT_APP_MEASUREMENT_ID) {
      this.analytics = app.analytics();
    }
  }

  setAnalyticsEvent(name) {
    if (environment) {
      this.analytics.logEvent(`--${environment}-${name}`);
    }
  }

  // Get the Firebase date (not User's local date)
  getCurrentDate = async () => {
    await this.set({
      path: ".info",
      document: "server",
      data: {
        timestamp: app.firestore.FieldValue.serverTimestamp(),
      },
    });
    const server = await this.getDocument({
      path: ".info",
      document: "server",
    });

    return new Date(server.timestamp.seconds * 1000);
  };

  // Listen for changes on a whole collection
  onCollection = ({
    path,
    orderBy,
    limit,
    where,
    onSnapshot,
    onError,
    onCompletion,
  }) => {
    return this.prepareListQuery({ path, orderBy, limit, where }).onSnapshot(
      (collection) => onSnapshot(getDocsWithId(collection)),
      logError,
      onCompletion,
    );
  };

  // Listen for changes on a particular document
  onDocumentV2 = ({ path, document, onSnapshot, onError, onCompletion }) => {
    return this.db
      .collection(path)
      .doc(document)
      .onSnapshot(
        (doc) => onSnapshot(getDocWithId(doc)),
        logError,
        onCompletion,
      );
  };

  // Listen for changes on a particular document
  onDocument = (path, document, { onSnapshot, onError, onCompletion }) => {
    return this.db
      .collection(path)
      .doc(document)
      .onSnapshot(
        (doc) => onSnapshot(getDocWithId(doc)),
        logError,
        onCompletion,
      );
  };

  prepareListQuery = ({ path, orderBy, limit, where }) => {
    let reference = this.db.collection(path).limit(limit || 10);

    if (orderBy) {
      // TODO: order by several properties
      const [property, direction] = orderBy[0].split("-");
      reference = reference.orderBy(property, direction);
    }

    if (where) {
      where.map(([a, b, c]) => (reference = reference.where(a, b, c)));
    }

    return reference;
  };

  getList = async ({ path, include, orderBy, limit, where }) => {
    const reference = this.prepareListQuery({ path, orderBy, limit, where });
    const listQuerySnapshot = await reference.get();

    const entities = await Promise.all(
      listQuerySnapshot.docs.map(async (querySnapshot) => ({
        ...getDocWithId(querySnapshot),
        ...(await this.getSubcollections({ querySnapshot, include, limit })),
      })),
    );

    return entities;
  };

  setV2 = async ({ path, document, data, replace }) => {
    const collection = this.db.collection(path);
    const dataWithDefaultFields = this.getDataWithDefaultFields(data);

    if (document) {
      collection.doc(document).set(dataWithDefaultFields, { merge: !replace });
    } else {
      collection.add(dataWithDefaultFields);
    }
  };

  set = async ({ path, document, data, replace }) =>
    this.db
      .collection(path)
      .doc(document)
      .set(this.getDataWithDefaultFields(data), { merge: !replace });

  getDocument = async ({ path, document, include }) => {
    if (document === "") {
      return;
    }

    const querySnapshot = await this.db.collection(path).doc(document).get();

    if (!querySnapshot.exists) {
      return;
    }

    return {
      ...getDocWithId(querySnapshot),
      ...(await this.getSubcollections({ querySnapshot, include })),
    };
  };

  getSubcollections = async ({ querySnapshot, include, limit }) => {
    const subcollections = {};

    if (include) {
      await Promise.all(
        include.map(async (detailLevelEntityPair) => {
          // TODO take detailLevel into account
          const [detailLevel, entity] = detailLevelEntityPair.split("-");
          const entities = await this.getList({
            path: `${querySnapshot.ref.path}/${entity}`,
            limit,
            include,
          });

          subcollections[entity] = entities;
        }),
      );
    }

    return subcollections;
  };

  getDataWithDefaultFields = (data) => ({
    ...data,
    created: data.created ? data.created : app.firestore.Timestamp.now(),
    modified: app.firestore.Timestamp.now(),
  });

  getServerTimestamp = () => app.firestore.Timestamp.now();
}

export default Firebase;
